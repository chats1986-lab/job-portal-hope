import { apiClient } from "@/lib/api/client";
import type { ApiResponse, JobRequest, JobResponse, JobSearchRequest } from "@/types";

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
}

export const jobsService = {
  list: (filters: JobSearchRequest = {}) =>
    apiClient.get<PaginatedResponse<JobResponse>>("/api/jobs", { query: filters as Record<string, unknown> }),
  getById: (id: number | string) => apiClient.get<JobResponse>(`/api/jobs/${id}`),
  byCompany: (companyId: number | string) =>
    apiClient.get<JobResponse[]>(`/api/jobs/company/${companyId}`),
  adminAll: () => apiClient.get<JobResponse[]>("/api/jobs/admin"),
  create: (data: JobRequest) => apiClient.post<JobResponse>("/api/jobs", data),
  update: (id: number | string, data: JobRequest) =>
    apiClient.put<JobResponse>(`/api/jobs/${id}`, data),
  publish: (id: number | string) => apiClient.patch<JobResponse>(`/api/jobs/${id}/publish`),
  close: (id: number | string) => apiClient.patch<JobResponse>(`/api/jobs/${id}/close`),
  remove: (id: number | string) => apiClient.delete<ApiResponse>(`/api/jobs/${id}`),
  saveJob: (jobId: string) => apiClient.post(`/api/jobs/${jobId}/save`),
  unsaveJob: (jobId: string) => apiClient.delete(`/api/jobs/${jobId}/unsave`),
  getSavedJobs: () => apiClient.get<JobResponse[]>('/api/jobs/saved'),
  isJobSaved: (jobId: string) => apiClient.get<boolean>(`/api/jobs/${jobId}/is-saved`)
};
