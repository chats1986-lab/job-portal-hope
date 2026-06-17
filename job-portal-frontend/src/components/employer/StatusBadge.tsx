import { ApplicationStatus, JobStatus } from "@/types";
import { cn } from "@/lib/utils";

const appStyle: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "bg-slate-100 text-slate-700",
  [ApplicationStatus.REVIEWING]: "bg-sky-50 text-sky-700",
  [ApplicationStatus.SHORTLISTED]: "bg-violet-50 text-violet-700",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "bg-amber-50 text-amber-700",
  [ApplicationStatus.HIRED]: "bg-emerald-50 text-emerald-700",
  [ApplicationStatus.REJECTED]: "bg-rose-50 text-rose-700",
  [ApplicationStatus.WITHDRAWN]: "bg-zinc-100 text-zinc-600",
};

const jobStyle: Record<JobStatus, string> = {
  [JobStatus.DRAFT]: "bg-slate-100 text-slate-700",
  [JobStatus.OPEN]: "bg-emerald-50 text-emerald-700",
  [JobStatus.CLOSED]: "bg-zinc-100 text-zinc-600",
  [JobStatus.EXPIRED]: "bg-amber-50 text-amber-700",
  [JobStatus.FILLED]: "bg-sky-50 text-sky-700",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", appStyle[status])}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", jobStyle[status])}>
      {status}
    </span>
  );
}
