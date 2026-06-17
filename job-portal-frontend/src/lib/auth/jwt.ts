export interface JwtPayload {
  sub?: string;
  userId?: string | number;
  id?: string | number;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [k: string]: unknown;
}

function base64UrlDecode(input: string): string {
  let s = input.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  if (typeof atob === "function") return atob(s);
  // Node fallback (SSR)
  return Buffer.from(s, "base64").toString("binary");
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const json = decodeURIComponent(
      Array.from(base64UrlDecode(parts[1]))
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractUserId(payload: JwtPayload | null): string | null {
  if (!payload) return null;
  const candidates: Array<unknown> = [payload.userId, payload.id, payload.sub];
  for (const c of candidates) {
    if (c !== undefined && c !== null && c !== "") return String(c);
  }
  return null;
}

export function extractRole(payload: JwtPayload | null): string | null {
  if (!payload) return null;
  const r = (payload.role ?? (payload as Record<string, unknown>).authorities) as unknown;
  if (typeof r === "string" && r) return r;
  if (Array.isArray(r) && r.length > 0 && typeof r[0] === "string") return r[0] as string;
  return null;
}

export function isExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  return payload.exp * 1000 < Date.now();
}
