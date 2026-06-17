import { redirect } from "@tanstack/react-router";
import { decodeJwt, extractRole, isExpired } from "./jwt";
import { UserRole, type UserResponse } from "@/types";

const TOKEN_KEY = "HireMe.token";
const USER_KEY = "HireMe.user";

function readRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  const payload = decodeJwt(token);
  if (isExpired(payload)) return null;
  const r = extractRole(payload);
  if (r) return r as UserRole;
  try {
    const raw = localStorage.getItem(USER_KEY);
    const u = raw ? (JSON.parse(raw) as UserResponse) : null;
    return (u?.role as UserRole) ?? null;
  } catch {
    return null;
  }
}

/**
 * Block ROLE_EMPLOYER users from candidate-only routes (apply, dashboard,
 * resume builder, applications, saved jobs, AI tools). Sends them to the
 * employer portal instead. Read-only browsing of /jobs is still allowed.
 */
export function blockEmployer() {
  if (typeof window === "undefined") return;
  const role = readRole();
  if (role === UserRole.ROLE_EMPLOYER) {
    throw redirect({ to: "/employer/dashboard" });
  }
}

/**
 * Block ROLE_JOB_SEEKER (and unauthenticated) from employer routes.
 * Used inside the _employer layout in addition to its existing auth check.
 */
export function requireEmployer() {
  if (typeof window === "undefined") return;
  const role = readRole();
  if (role === UserRole.ROLE_JOB_SEEKER) {
    throw redirect({ to: "/dashboard" });
  }
}
