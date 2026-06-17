import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { ExperienceLevel, JobType, WorkMode } from "@/types";

const search = z.object({
  q: z.string().optional(),
  loc: z.string().optional(),
  jobType: z.nativeEnum(JobType).optional(),
  workMode: z.nativeEnum(WorkMode).optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
});

export const Route = createFileRoute("/jobs")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Jobs — HireMe" },
      { name: "description", content: "Browse open roles across companies hiring now." },
    ],
  }),
  component: JobsLayout,
});

function JobsLayout() {
  return <Outlet />;
}
