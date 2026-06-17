import { apiClient } from "@/lib/api/client";
import type { ApiResponse, EducationResponse } from "@/types";

const headerOpts = { userIdHeaderName: "X-User-id" as const };

export interface EducationRequest {
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying?: boolean;
  description?: string;
  displayOrder?: number;
}

const base = (resumeId: number | string) => `/api/resume/${resumeId}/educations`;

export const educationsService = {
  list: (resumeId: number | string) =>
    apiClient.get<EducationResponse[]>(base(resumeId), headerOpts),
  create: (resumeId: number | string, data: EducationRequest) =>
    apiClient.post<EducationResponse>(base(resumeId), data, headerOpts),
  update: (resumeId: number | string, id: number, data: EducationRequest) =>
    apiClient.put<EducationResponse>(`${base(resumeId)}/${id}`, data, headerOpts),
  remove: (resumeId: number | string, id: number) =>
    apiClient.delete<ApiResponse>(`${base(resumeId)}/${id}`, headerOpts),
};
