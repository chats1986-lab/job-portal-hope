import { cn } from "@/lib/utils";
import { JobStatus } from "@/types";

export function SkillBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusStyles: Record<JobStatus, string> = {
  [JobStatus.OPEN]: "bg-success-soft text-success",
  [JobStatus.CLOSED]: "bg-muted text-muted-foreground",
  [JobStatus.DRAFT]: "bg-warning/20 text-warning-foreground",
  [JobStatus.EXPIRED]: "bg-destructive/15 text-destructive",
  [JobStatus.FILLED]: "bg-info-soft text-info",
};

export function StatusBadge({ status }: { status: JobStatus | string }) {
  const key = (status as JobStatus) in statusStyles ? (status as JobStatus) : JobStatus.OPEN;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        statusStyles[key],
      )}
    >
      {status}
    </span>
  );
}
