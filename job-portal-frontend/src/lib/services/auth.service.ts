import { apiClient } from "@/lib/api/client";
import type { AuthResponse, LoginRequest, SignupRequest } from "@/types";

export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", data, { userId: null }),
  signup: (data: SignupRequest) =>
    apiClient.post<AuthResponse>("/auth/signup", data, { userId: null }),
};
