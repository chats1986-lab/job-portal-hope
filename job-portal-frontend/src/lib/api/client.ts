import { getAuthToken, getAuthUserId } from "@/lib/auth/store";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions {
  headers?: Record<string, string>;
  /** Override the X-User-Id header. Defaults to current authenticated user. */
  userId?: string | number | null;
  /** Use the rare `User-X-id` header instead of `X-User-Id` (saved-jobs POST). */
  userIdHeaderName?: "X-User-Id" | "X-User-id" | "User-X-id";
  /** Query-string params; arrays are repeated, undefined/null are dropped. */
  query?: Record<string, unknown>;
  /** Send body as application/x-www-form-urlencoded (for ?summary=... etc.). */
  raw?: boolean;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Record<string, unknown>): string {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      if (Array.isArray(v)) v.forEach((item) => url.searchParams.append(k, String(item)));
      else url.searchParams.append(k, String(v));
    }
  }
  return url.toString();
}

function buildHeaders(opts: RequestOptions = {}, hasBody = false): HeadersInit {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (hasBody && !opts.raw) headers["Content-Type"] = "application/json";

  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const userId = opts.userId !== undefined ? opts.userId : getAuthUserId();
  if (userId !== null && userId !== undefined && userId !== "") {
    const headerName = opts.userIdHeaderName ?? "X-User-Id";
    headers[headerName] = String(userId);
  }

  return { ...headers, ...(opts.headers ?? {}) };
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type") ?? "";
  const isJson = ct.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text();
  if (!res.ok) {
    const msg =
      (typeof body === "object" && body && "message" in body && String((body as { message: unknown }).message)) ||
      `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, body);
  }
  return body as T;
}

async function request<T>(
  method: string,
  path: string,
  data?: unknown,
  opts: RequestOptions = {},
): Promise<T> {
  const hasBody = data !== undefined && data !== null;
  const init: RequestInit = {
    method,
    headers: buildHeaders(opts, hasBody),
    signal: opts.signal,
  };
  if (hasBody) {
    init.body = opts.raw ? (data as BodyInit) : JSON.stringify(data);
  }
  const res = await fetch(buildUrl(path, opts.query), init);
  return parseResponse<T>(res);
}

export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>("GET", path, undefined, opts),
  post: <T>(path: string, data?: unknown, opts?: RequestOptions) =>
    request<T>("POST", path, data, opts),
  put: <T>(path: string, data?: unknown, opts?: RequestOptions) =>
    request<T>("PUT", path, data, opts),
  patch: <T>(path: string, data?: unknown, opts?: RequestOptions) =>
    request<T>("PATCH", path, data, opts),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>("DELETE", path, undefined, opts),
};

export { API_BASE_URL };
