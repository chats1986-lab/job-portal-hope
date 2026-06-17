import { apiClient } from "@/lib/api/client";
import type {
  ApiResponse,
  CompanyRequest,
  CompanyResponse,
  CompanyStatus,
  CompanyType,
  IndustryType,
} from "@/types";

export interface CompanyListFilters {
  companyType?: CompanyType;
  industryType?: IndustryType;
  companyStatus?: CompanyStatus;
}

export const companiesService = {
  create: (data: CompanyRequest) => apiClient.post<CompanyResponse>("/api/companies", data),
  getById: (id: number | string) => apiClient.get<CompanyResponse>(`/api/companies/${id}`),
  mine: () => apiClient.get<CompanyResponse>("/api/companies/my"),
  list: (filters: CompanyListFilters = {}) =>
    apiClient.get<CompanyResponse[]>("/api/companies", { query: filters as Record<string, unknown> }),
  update: (id: number | string, data: CompanyRequest) =>
    apiClient.put<CompanyResponse>(`/api/companies/${id}`, data),
  verify: (id: number | string) => apiClient.patch<CompanyResponse>(`/api/companies/${id}/verify`),
  deactivate: (id: number | string) =>
    apiClient.patch<CompanyResponse>(`/api/companies/${id}/deactivate`),
  remove: (id: number | string) => apiClient.delete<ApiResponse>(`/api/companies/${id}`),
};
