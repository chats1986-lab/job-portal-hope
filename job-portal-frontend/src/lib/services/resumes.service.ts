import { apiClient } from "@/lib/api/client";
import type {
  ApiResponse,
  PersonalInfoResponse,
  ResumeRequest,
  ResumeResponse,
} from "@/types";

// Resume service uses lowercase header name `X-User-id` per backend spec.
const headerOpts = { userIdHeaderName: "X-User-id" as const };

export const resumesService = {
  create: (data: ResumeRequest) =>
    apiClient.post<ResumeResponse>("/api/resume", data, headerOpts),
  getById: (resumeId: number | string) =>
    apiClient.get<ResumeResponse>(`/api/resume/${resumeId}`, headerOpts),
  list: () => apiClient.get<ResumeResponse[]>("/api/resume/my", headerOpts),
  updatePersonalInfo: (resumeId: number | string, data: PersonalInfoResponse) =>
    apiClient.put<ResumeResponse>(`/api/resume/${resumeId}/personal-info`, data, headerOpts),
  updateSummary: (resumeId: number | string, summary: string) =>
    apiClient.patch<ResumeResponse>(`/api/resume/${resumeId}/summary`, undefined, {
      ...headerOpts,
      query: { summary },
    }),
  setDefault: (resumeId: number | string) =>
    apiClient.patch<ResumeResponse>(`/api/resume/${resumeId}/set-default`, undefined, headerOpts),
  remove: (resumeId: number | string) =>
    apiClient.delete<ApiResponse>(`/api/resume/${resumeId}`, headerOpts),
};
