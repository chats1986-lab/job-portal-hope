import { apiClient } from "@/lib/api/client";
import type { ApiResponse, JobType, WorkExperienceResponse } from "@/types";

const headerOpts = { userIdHeaderName: "X-User-id" as const };

export interface WorkExperienceRequest {
  companyName: string;
  companyLogoUrl?: string;
  jobTitle: string;
  employmentType?: JobType;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentJob?: boolean;
  description?: string;
  technologies?: string[];
  displayOrder?: number;
}

const base = (resumeId: number | string) => `/api/resume/${resumeId}/work-experiences`;

export const workExperiencesService = {
  list: (resumeId: number | string) =>
    apiClient.get<WorkExperienceResponse[]>(base(resumeId), headerOpts),
  create: (resumeId: number | string, data: WorkExperienceRequest) =>
    apiClient.post<WorkExperienceResponse>(base(resumeId), data, headerOpts),
  update: (resumeId: number | string, id: number, data: WorkExperienceRequest) =>
    apiClient.put<WorkExperienceResponse>(`${base(resumeId)}/${id}`, data, headerOpts),
  remove: (resumeId: number | string, id: number) =>
    apiClient.delete<ApiResponse>(`${base(resumeId)}/${id}`, headerOpts),
  reorder: (resumeId: number | string, ids: number[]) =>
    apiClient.patch<ApiResponse>(`${base(resumeId)}/reorder`, { ids }, headerOpts),
};
