import { apiClient } from "@/lib/api/client";

interface CoverLetterRequest {
  jobTitle: string;
  companyName?: string;
  jobDescription?: string;
  resumeSummary?: string;
  candidateName: string;
}

interface CoverLetterResponse {
  coverLetter: string;
}

export const generateCoverLetter = async (data: CoverLetterRequest): Promise<CoverLetterResponse> => {
  const result = await apiClient.post<{ content: string }>("/api/ai/application/cover-letter", {
    jobTitle: data.jobTitle,
    jobDescription: data.jobDescription,
    candidateName: data.candidateName,
    candidateSummary: data.resumeSummary,
    targetCompanyName: data.companyName,
  });
  return { coverLetter: result.content };
};
