import { apiClient } from "@/lib/api/client";

export interface ScreeningScoreRequest {
  applicationId: number | string;
  jobId?: number | string;
  resumeId?: number | string;
}

export interface ScreeningScoreResponse {
  score: number;
  skillsMatchScore: number;
  educationMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  concerns: string[];
  summary: string;
}

export interface SkillsGapRequest {
  applicationId?: number | string;
  jobId?: number | string;
  resumeId?: number | string;
}

export interface LearningRecommendation {
  skills: string;
  why: string;
  howToLearn: string;
}

export interface SkillsGapResponse {
  matchedSkills: string[];
  missingSkills: string[];
  partialMatch: string[];
  prioritySkillsToLearn: string[];
  learningRecommendations: LearningRecommendation[];
  overallReadiness: string;
  summary: string;
}

export interface AiCoverLetterRequest {
  jobTitle: string;
  jobDescription?: string;
  candidateName: string;
  candidateSummary?: string;
  targetCompanyName?: string;
}

export const aiApplicationService = {
  screeningScore: (applicationId: number | string) =>
    apiClient.get<ScreeningScoreResponse>(`/api/ai/application/screening-score/${applicationId}`),
  skillsGap: (applicationId: number | string) =>
    apiClient.get<SkillsGapResponse>(`/api/ai/application/skills-gap/${applicationId}`),
  coverLetter: (data: AiCoverLetterRequest) =>
    apiClient.post<{ content: string }>("/api/ai/application/cover-letter", data),
};
