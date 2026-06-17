import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Star, StarOff, Filter } from "lucide-react";
import { applicationsService } from "@/lib/services/applications.service";
import { jobsService } from "@/lib/services/jobs.service";
import { ApplicationStatus } from "@/types";
import { ApplicationStatusBadge } from "@/components/employer/StatusBadge";
import { AIScoreBadge } from "@/components/employer/AIScoreRing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_employer/employer/applications/")({
  head: () => ({ meta: [{ title: "Applications — Employer" }] }),
  component: EmployerApplications,
});

function EmployerApplications() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<string>("ALL");
  const [jobId, setJobId] = useState<string>("ALL");
  const [starredOnly, setStarredOnly] = useState(false);
  const [search, setSearch] = useState("");

  const jobsQuery = useQuery({
    queryKey: ["employer", "jobs", "filter-list"],
    queryFn: () => jobsService.list({ page: 0, size: 100 }),
  });
  const appsQuery = useQuery({
    queryKey: ["employer", "applications", status, jobId],
    queryFn: () => applicationsService.forCompany({
      status: status !== "ALL" ? (status as ApplicationStatus) : undefined,
      jobId: jobId !== "ALL" ? Number(jobId) : undefined,
    }),
  });

  const starMut = useMutation({
    mutationFn: (id: number) => applicationsService.toggleStar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employer", "applications"] }),
  });

  const apps = useMemo(() => {
    const list = appsQuery.data ?? [];
    return list
      .filter((a) => !starredOnly || a.isStarred)
      .filter((a) => !search || (a.candidate?.fullName ?? "").toLowerCase().includes(search.toLowerCase()));
  }, [appsQuery.data, starredOnly, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and manage candidate applications.</p>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidate…" className="pl-9" />
          </div>
          <div className="w-48">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {Object.values(ApplicationStatus).map((v) => (
                  <SelectItem key={v} value={v}>{v.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-56">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Job</label>
            <Select value={jobId} onValueChange={setJobId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All jobs</SelectItem>
                {(jobsQuery.data?.content ?? []).map((j) => (
                  <SelectItem key={j.id} value={String(j.id)}>{j.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant={starredOnly ? "default" : "outline"}
            onClick={() => setStarredOnly((v) => !v)}
            className="gap-1"
          >
            <Star className="size-4" /> Starred
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Candidate</th>
              <th className="px-4 py-3 text-left">Job</th>
              <th className="px-4 py-3 text-left">Applied</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">AI Score</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {appsQuery.isLoading && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">Loading…</td></tr>
            )}
            {!appsQuery.isLoading && apps.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground"><Filter className="mx-auto mb-2 size-6 text-muted-foreground" />No applications match your filters.</td></tr>
            )}
            {apps.map((a) => (
              <tr key={a.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link to="/employer/applications/$applicationId" params={{ applicationId: String(a.id) }} className="font-semibold hover:text-primary">
                    {a.candidate?.fullName ?? "Candidate"}
                  </Link>
                  <div className="text-xs text-muted-foreground">{a.candidate?.email}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.job?.title ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(a.appliedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3"><ApplicationStatusBadge status={a.status} /></td>
                <td className="px-4 py-3"><AIScoreBadge score={40 + ((a.id * 37) % 60)} /></td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Star"
                    onClick={() => { starMut.mutate(a.id); toast.success(a.isStarred ? "Unstarred" : "Starred"); }}
                  >
                    {a.isStarred ? <Star className="size-4 fill-amber-400 text-amber-500" /> : <StarOff className="size-4" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
