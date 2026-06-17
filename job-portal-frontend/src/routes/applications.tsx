import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { blockEmployer } from "@/lib/auth/guards";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Briefcase, Clock, MapPin } from "lucide-react";
import { AppLayout } from "@/components/templates/AppLayout";
import { SkillBadge } from "@/components/atoms/Badges";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/molecules/EmptyState";
import { applicationsService } from "@/lib/services/applications.service";
import { formatDate, formatJobLocation, humanizeEnum } from "@/lib/format";
import { useAuth } from "@/lib/auth/context";
import { ApplicationStatus } from "@/types";

export const Route = createFileRoute("/applications")({
  beforeLoad: () => blockEmployer(),
  head: () => ({ meta: [{ title: "My Applications — HireMe" }] }),
  component: ApplicationsPage,
});

const statusStyles: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "bg-info-soft text-info",
  [ApplicationStatus.REVIEWING]: "bg-warning/20 text-warning-foreground",
  [ApplicationStatus.SHORTLISTED]: "bg-info-soft text-info",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "bg-info-soft text-info",
  [ApplicationStatus.HIRED]: "bg-success-soft text-success",
  [ApplicationStatus.REJECTED]: "bg-destructive/15 text-destructive",
  [ApplicationStatus.WITHDRAWN]: "bg-muted text-muted-foreground",
};

function ApplicationsPage() {
  const { isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && !isAuthenticated) navigate({ to: "/auth/login" });
  }, [isAuthenticated, isReady, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["applications", "my"],
    queryFn: () => applicationsService.my(),
    enabled: isAuthenticated,
  });

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold">My Applications</h1>
        <p className="mt-1 text-muted-foreground">Track the status of every application you've submitted.</p>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : !data || data.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              description="Start applying to roles to see them here."
              action={<Link to="/jobs"><Button>Browse Jobs</Button></Link>}
            />
          ) : (
            data.map((app) => {
              const job = app.job;
              const location = job ? formatJobLocation({ city: job.city, state: job.state, country: job.country, workMode: job.workMode }) : "—";
              return (
                <div key={app.id} className="flex items-center justify-between rounded-xl border bg-card p-5">
                  <div>
                    {job ? (
                      <Link to="/jobs/$jobId" params={{ jobId: String(job.id) }} className="font-display text-lg font-semibold hover:text-primary">
                        {job.title}
                      </Link>
                    ) : (
                      <div className="font-display text-lg font-semibold">Application #{app.id}</div>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      {job?.company?.name && <span>{job.company.name}</span>}
                      <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {location}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> Applied {formatDate(app.appliedAt)}</span>
                    </div>
                  </div>
                  <SkillBadge className={statusStyles[app.status]}>{humanizeEnum(app.status)}</SkillBadge>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
