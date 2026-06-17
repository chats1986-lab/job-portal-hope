import { apiClient } from "@/lib/api/client";
import type { ApiResponse, JobCategoryRequest, JobCategoryResponse } from "@/types";

export const jobCategoriesService = {
  list: () => apiClient.get<JobCategoryResponse[]>("/api/job-categories"),
  getById: (id: number | string) =>
    apiClient.get<JobCategoryResponse>(`/api/job-categories/${id}`),
  create: (data: JobCategoryRequest) =>
    apiClient.post<JobCategoryResponse>("/api/job-categories", data),
  update: (id: number | string, data: JobCategoryRequest) =>
    apiClient.put<JobCategoryResponse>(`/api/job-categories/${id}`, data),
  remove: (id: number | string) => apiClient.delete<ApiResponse>(`/api/job-categories/${id}`),
};
