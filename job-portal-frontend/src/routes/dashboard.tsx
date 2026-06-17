import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { blockEmployer } from "@/lib/auth/guards";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Briefcase, FileText, Send, Bookmark } from "lucide-react";
import { AppLayout } from "@/components/templates/AppLayout";
import { Button } from "@/components/ui/button";
import { applicationsService } from "@/lib/services/applications.service";
import { resumesService } from "@/lib/services/resumes.service";
import { jobsService } from "@/lib/services/jobs.service";
import { savedJobsService } from "@/lib/services/saved-jobs.service";
import { useAuth } from "@/lib/auth/context";
import { humanizeEnum, formatJobLocation } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => blockEmployer(),
  head: () => ({ meta: [{ title: "Dashboard — HireMe" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && !isAuthenticated) navigate({ to: "/auth/login" });
  }, [isAuthenticated, isReady, navigate]);

  const { data: apps } = useQuery({
    queryKey: ["applications", "my"],
    queryFn: () => applicationsService.my(),
    enabled: isAuthenticated,
  });
  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => resumesService.list(),
    enabled: isAuthenticated,
  });
  const { data: jobs } = useQuery({
    queryKey: ["jobs", "home"],
    queryFn: () => jobsService.list({ size: 8 }),
  });
  const { data: saved } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: () => savedJobsService.list(),
    enabled: isAuthenticated,
  });

  const stats = [
    { label: "Applications", value: apps?.length ?? 0, icon: Send, accent: "text-info bg-info-soft" },
    { label: "Resumes", value: resumes?.length ?? 0, icon: FileText, accent: "text-success bg-success-soft" },
    { label: "Saved Jobs", value: saved?.length ?? 0, icon: Bookmark, accent: "text-warning-foreground bg-warning/20" },
    { label: "Open Jobs", value: jobs?.totalElements ?? jobs?.content?.length ?? 0, icon: Briefcase, accent: "text-primary bg-secondary" },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back{user ? `, ${user.fullName}` : ""}</h1>
          {user?.email && <p className="mt-1 text-muted-foreground">{user.email}</p>}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border bg-card p-5">
                <div className={`grid size-10 place-items-center rounded-lg ${s.accent}`}><Icon className="size-5" /></div>
                <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Recent Applications</h2>
              <Link to="/applications" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {apps?.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                  <div>
                    <div className="font-medium">{a.job?.title ?? `Application #${a.id}`}</div>
                    <div className="text-xs text-muted-foreground">{a.job?.company?.name ?? ""}</div>
                  </div>
                  <span className="rounded-full bg-info-soft px-2.5 py-1 text-xs font-semibold text-info">{humanizeEnum(a.status)}</span>
                </div>
              ))}
              {(!apps || apps.length === 0) && (
                <p className="text-sm text-muted-foreground">No applications yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Recommended Jobs</h2>
              <Link to="/jobs" className="text-sm text-primary hover:underline">Browse all</Link>
            </div>
            <div className="space-y-3">
              {jobs?.content?.slice(0, 4).map((j) => {
                const location = formatJobLocation({ city: j.city, state: j.state, country: j.country, workMode: j.workMode });
                return (
                  <Link key={j.id} to="/jobs/$jobId" params={{ jobId: String(j.id) }} className="flex items-center justify-between rounded-lg bg-muted/40 p-3 hover:bg-muted">
                    <div>
                      <div className="font-medium">{j.title}</div>
                      <div className="text-xs text-muted-foreground">{j.company?.name ?? ""} · {location}</div>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
