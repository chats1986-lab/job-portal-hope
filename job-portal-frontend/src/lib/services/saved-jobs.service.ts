import { apiClient } from "@/lib/api/client";
import type { ApiResponse, SavedJobRequest, SavedJobResponse } from "@/types";

export const savedJobsService = {
  // Backend uses the inconsistent `User-X-id` header on POST.
  save: (data: SavedJobRequest) =>
    apiClient.post<SavedJobResponse>("/api/preferences/saved-jobs", data, {
      userIdHeaderName: "User-X-id",
    }),
  list: () => apiClient.get<SavedJobResponse[]>("/api/preferences/saved-jobs"),
  isSaved: (jobId: number | string) =>
    apiClient.get<boolean>("/api/preferences/saved-jobs/check", { query: { jobId } }),
  unsave: (savedJobId: number | string) =>
    apiClient.delete<ApiResponse>(`/api/preferences/saved-jobs/${savedJobId}`),
};
