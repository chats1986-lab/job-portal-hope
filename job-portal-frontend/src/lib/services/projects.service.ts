import { apiClient } from "@/lib/api/client";
import type { ApiResponse, ProjectResponse } from "@/types";

const headerOpts = { userIdHeaderName: "X-User-id" as const };

export interface ProjectRequest {
  title: string;
  description?: string;
  technologies?: string[];
  projectUrl?: string;
  sourceCodeUrl?: string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
  displayOrder?: number;
}

const base = (resumeId: number | string) => `/api/resume/${resumeId}/projects`;

export const projectsService = {
  list: (resumeId: number | string) =>
    apiClient.get<ProjectResponse[]>(base(resumeId), headerOpts),
  create: (resumeId: number | string, data: ProjectRequest) =>
    apiClient.post<ProjectResponse>(base(resumeId), data, headerOpts),
  update: (resumeId: number | string, id: number, data: ProjectRequest) =>
    apiClient.put<ProjectResponse>(`${base(resumeId)}/${id}`, data, headerOpts),
  remove: (resumeId: number | string, id: number) =>
    apiClient.delete<ApiResponse>(`${base(resumeId)}/${id}`, headerOpts),
};
