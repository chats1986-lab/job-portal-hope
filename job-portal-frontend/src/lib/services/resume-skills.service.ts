import { apiClient } from "@/lib/api/client";
import type { ApiResponse, ProficiencyLevel, ResumeSkillResponse } from "@/types";

const headerOpts = { userIdHeaderName: "X-User-id" as const };

export interface ResumeSkillRequest {
  skillName: string;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number;
  displayOrder?: number;
}

const base = (resumeId: number | string) => `/api/resume/${resumeId}/skills`;

export const resumeSkillsService = {
  list: (resumeId: number | string) =>
    apiClient.get<ResumeSkillResponse[]>(base(resumeId), headerOpts),
  create: (resumeId: number | string, data: ResumeSkillRequest) =>
    apiClient.post<ResumeSkillResponse>(base(resumeId), data, headerOpts),
  update: (resumeId: number | string, id: number, data: ResumeSkillRequest) =>
    apiClient.put<ResumeSkillResponse>(`${base(resumeId)}/${id}`, data, headerOpts),
  remove: (resumeId: number | string, id: number) =>
    apiClient.delete<ApiResponse>(`${base(resumeId)}/${id}`, headerOpts),
};
