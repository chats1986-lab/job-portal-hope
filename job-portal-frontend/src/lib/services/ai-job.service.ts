import { apiClient } from "@/lib/api/client";
import type { ExperienceLevel, JobType, WorkMode } from "@/types";

export interface AiDescribeRequest {
  title: string;
  skills?: string[];
  experienceLevel?: ExperienceLevel;
  jobType?: JobType;
  workMode?: WorkMode;
  companyName?: string;
}

export interface AiSalaryRequest {
  title: string;
  skills?: string[];
  experienceLevel?: ExperienceLevel;
  location?: string;
  jobType?: JobType;
}

export interface AiSalaryResponse {
  minSalary: number;
  maxSalary: number;
  currency?: string;
  rationale?: string;
}

const text = async (path: string, opts?: Parameters<typeof apiClient.get>[1]) => {
  try {
    const res = await apiClient.get<unknown>(path, opts);
    if (typeof res === "string") return res;
    if (res && typeof res === "object") {
      const o = res as Record<string, unknown>;
      return String(o.content ?? o.text ?? o.result ?? o.data ?? JSON.stringify(res));
    }
    return String(res ?? "");
  } catch (e) {
    throw e;
  }
};

export const aiJobService = {
  describe: (data: AiDescribeRequest) =>
    apiClient.post<{ description: string } | string>("/api/ai/job/describe", data),

  requirements: (params: { title: string; description?: string }) =>
    text("/api/ai/job/requirements", { query: params as Record<string, unknown> }),

  responsibilities: (params: { title: string; category?: string }) =>
    text("/api/ai/job/responsibilities", { query: params as Record<string, unknown> }),

  benefits: (params: { title: string; category?: string; jobType?: JobType }) =>
    text("/api/ai/job/benefits", { query: params as Record<string, unknown> }),

  salarySuggestion: (data: AiSalaryRequest) =>
    apiClient.post<AiSalaryResponse>("/api/ai/job/salary-suggestion", data),

  skillsRecommendation: (params: { title: string; description?: string }) =>
    apiClient.get<string[] | { skills: string[] }>("/api/ai/job/skills-recommendation", {
      query: params as Record<string, unknown>,
    }),

  tagRecommendation: (params: { title: string; description?: string }) =>
    apiClient.get<string[] | { tags: string[] }>("/api/ai/job/tag-recommendation", {
      query: params as Record<string, unknown>,
    }),
};

export function extractDescription(res: { description?: string; content?: string } | string): string {
  if (typeof res === "string") return res;
  return res.description ?? res.content ?? "";
}

export function extractList(res: string[] | { skills?: string[]; tags?: string[]; content?: string }): string[] {
  if (Array.isArray(res)) return res;
  if (res.skills) return res.skills;
  if (res.tags) return res.tags;
  if (res.content) {
    // Handle comma-separated string response
    return res.content.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}
