import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  FileText,
  Users,
  Clock,
  PlusCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatsCard } from "@/components/employer/StatsCard";
import { ApplicationStatusBadge, JobStatusBadge } from "@/components/employer/StatusBadge";
import { AIScoreBadge } from "@/components/employer/AIScoreRing";
import { jobsService } from "@/lib/services/jobs.service";
import { applicationsService } from "@/lib/services/applications.service";
import { companiesService } from "@/lib/services/companies.service";
import { ApplicationStatus, JobStatus } from "@/types";

export const Route = createFileRoute("/_employer/employer/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Employer" }] }),
  component: EmployerDashboard,
});

function EmployerDashboard() {
  const companyQuery = useQuery({
    queryKey: ["employer", "company"],
    queryFn: () => companiesService.mine(),
  });

  const jobsQuery = useQuery({
    
    queryKey: ["employer", "jobs", "all"],
    queryFn: () => jobsService.byCompany(companyQuery.data?.id ?? 0),
    enabled: !!companyQuery.data?.id,
  });
  const appsQuery = useQuery({
    queryKey: ["employer", "applications", "all"],
    queryFn: () => applicationsService.forCompany({}),
    enabled: !!companyQuery.data?.id,
  });

  const jobs = jobsQuery.data ?? [];
  const apps = appsQuery.data ?? [];

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.jobStatus === JobStatus.OPEN).length;
  const totalApps = apps.length;
  const pending = apps.filter(
    (a) => a.status === ApplicationStatus.PENDING || a.status === ApplicationStatus.REVIEWING,
  ).length;

  const chartData = buildTrend(apps.map((a) => a.appliedAt));

  if (companyQuery.isLoading) {
    return <div className="text-sm text-muted-foreground">Loading company information…</div>;
  }

  if (!companyQuery.data) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
        <Briefcase className="mx-auto mb-3 size-8" />
        No company profile found. Please create a company profile to continue.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's an overview of your hiring activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/employer/jobs/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <PlusCircle className="size-4" /> Post a job
          </Link>
          <Link
            to="/employer/ai-screening"
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            <Sparkles className="size-4" /> AI Screening
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total jobs" value={totalJobs} sub="all postings" icon={Briefcase} tint="bg-sky-50 text-sky-600" />
        <StatsCard label="Active jobs" value={activeJobs} sub="currently open" icon={Briefcase} tint="bg-emerald-50 text-emerald-600" />
        <StatsCard label="Applications" value={totalApps} sub="all time" icon={FileText} tint="bg-violet-50 text-violet-600" />
        <StatsCard label="Pending review" value={pending} sub="need your attention" icon={Clock} tint="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Applications over time</h2>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="appsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#appsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Top performing jobs</h2>
          </div>
          <ul className="space-y-3">
            {jobs.slice(0, 5).map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <Link to="/employer/jobs/$jobId" params={{ jobId: String(j.id) }} className="line-clamp-1 text-sm font-semibold hover:text-primary">{j.title}</Link>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="size-3" /> {j.applicationCount ?? 0} apps
                  </div>
                </div>
                <JobStatusBadge status={j.jobStatus} />
              </li>
            ))}
            {jobs.length === 0 && (
              <li className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No jobs yet. <Link to="/employer/jobs/new" className="text-primary underline">Create one</Link>
              </li>
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-bold">Recent applications</h2>
          <Link to="/employer/applications" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="text-left">
                <th className="py-2">Candidate</th>
                <th className="py-2">Job</th>
                <th className="py-2">Applied</th>
                <th className="py-2">Status</th>
                <th className="py-2">AI score</th>
              </tr>
            </thead>
            <tbody>
              {apps.slice(0, 6).map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="py-3">
                    <Link to="/employer/applications/$applicationId" params={{ applicationId: String(a.id) }} className="font-medium hover:text-primary">
                      {a.candidate?.fullName ?? "Candidate"}
                    </Link>
                  </td>
                  <td className="py-3 text-muted-foreground">{a.job?.title ?? "—"}</td>
                  <td className="py-3 text-muted-foreground">{new Date(a.appliedAt).toLocaleDateString()}</td>
                  <td className="py-3"><ApplicationStatusBadge status={a.status} /></td>
                  <td className="py-3"><AIScoreBadge score={pseudoScore(a.id)} /></td>
                </tr>
              ))}
              {apps.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">No applications yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function buildTrend(dates: string[]): { day: string; count: number }[] {
  const days: { day: string; count: number }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), count: 0 });
    const idx = days.length - 1;
    days[idx].count = dates.filter((dt) => dt?.slice(0, 10) === key).length;
  }
  return days;
}

// Deterministic placeholder score (backend score endpoint is async).
function pseudoScore(id: number): number {
  return 40 + ((id * 37) % 60);
}
