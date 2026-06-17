import { apiClient } from "@/lib/api/client";
import type {
  ApiResponse,
  ApplicationRequest,
  ApplicationResponse,
  CompanyApplicationFilterRequest,
  UpdateApplicationStatusRequest,
  WithdrawApplicationRequest,
} from "@/types";

export const applicationsService = {
  create: (data: ApplicationRequest) =>
    apiClient.post<ApplicationResponse>("/api/applications", data),
  getById: (id: number | string) => apiClient.get<ApplicationResponse>(`/api/applications/${id}`),
  my: () => apiClient.get<ApplicationResponse[]>("/api/applications/my"),
  forCompany: (filters: CompanyApplicationFilterRequest = {}) =>
    apiClient.get<ApplicationResponse[]>("/api/applications/company", {
      query: filters as Record<string, unknown>,
    }),
  updateStatus: (id: number | string, data: UpdateApplicationStatusRequest) =>
    apiClient.patch<ApplicationResponse>(`/api/applications/${id}/status`, data),
  withdraw: (id: number | string, data: WithdrawApplicationRequest = {}) =>
    apiClient.patch<ApplicationResponse>(`/api/applications/${id}/withdraw`, data),
  toggleStar: (id: number | string) =>
    apiClient.patch<ApplicationResponse>(`/api/applications/${id}/star`),
  remove: (id: number | string) => apiClient.delete<ApiResponse>(`/api/applications/${id}`),
};
