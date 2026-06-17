export const ROUTES = {
  home: "/",
  jobs: "/jobs",
  jobDetail: (id: string | number) => `/jobs/${id}`,
  jobApply: (id: string | number) => `/jobs/${id}/apply`,
  login: "/auth/login",
  signup: "/auth/signup",
  dashboard: "/dashboard",
  applications: "/applications",
  resumes: "/resumes",
  aiMatch: "/ai-match",
  aiTools: "/ai-tools",
} as const;

export const SAMPLE_JOB_ID = "1";

export const SAMPLE_SEARCH_QUERY = "Senior React Engineer";
