// Module-level singleton synced by AuthProvider. The API client reads from
// here so services don't have to thread auth through every call.

let currentToken: string | null = null;
let currentUserId: string | null = null;

export function setAuthState(token: string | null, userId: string | null): void {
  currentToken = token;
  currentUserId = userId;
}

export function getAuthToken(): string | null {
  return currentToken;
}

export function getAuthUserId(): string | null {
  return currentUserId;
}
