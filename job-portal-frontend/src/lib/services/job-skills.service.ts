import { apiClient } from "@/lib/api/client";
import type { ApiResponse, JobSkillRequest, JobSkillResponse } from "@/types";

export const jobSkillsService = {
  list: () => apiClient.get<JobSkillResponse[]>("/api/job-skills"),
  getById: (id: number | string) => apiClient.get<JobSkillResponse>(`/api/job-skills/${id}`),
  create: (data: JobSkillRequest) => apiClient.post<JobSkillResponse>("/api/job-skills", data),
  update: (id: number | string, data: JobSkillRequest) =>
    apiClient.put<JobSkillResponse>(`/api/job-skills/${id}`, data),
  remove: (id: number | string) => apiClient.delete<ApiResponse>(`/api/job-skills/${id}`),
};
