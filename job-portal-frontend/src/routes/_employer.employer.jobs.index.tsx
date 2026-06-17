import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PlusCircle, Search, Trash2, Edit, MoreHorizontal, Eye, CheckCircle2, XCircle, Briefcase } from "lucide-react";
import { jobsService } from "@/lib/services/jobs.service";
import { companiesService } from "@/lib/services/companies.service";
import { JobStatus } from "@/types";
import { JobStatusBadge } from "@/components/employer/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_employer/employer/jobs/")({
  head: () => ({ meta: [{ title: "All Jobs — Employer" }] }),
  component: EmployerJobs,
});

const TABS: { key: "ALL" | JobStatus; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: JobStatus.OPEN, label: "Active" },
  { key: JobStatus.DRAFT, label: "Draft" },
  { key: JobStatus.CLOSED, label: "Closed" },
];

function EmployerJobs() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"ALL" | JobStatus>("ALL");
  const [search, setSearch] = useState("");

  const companyQuery = useQuery({
    queryKey: ["employer", "company"],
    queryFn: () => companiesService.mine(),
  });

  const jobsQuery = useQuery({
    queryKey: ["employer", "jobs", "all"],
    queryFn: () => jobsService.byCompany(companyQuery.data?.id ?? 0),
    enabled: !!companyQuery.data?.id,
  });

  const jobs = useMemo(() => {
    const all = jobsQuery.data ?? [];
    return all
      .filter((j) => tab === "ALL" || j.jobStatus === tab)
      .filter((j) => j.title.toLowerCase().includes(search.toLowerCase()));
  }, [jobsQuery.data, tab, search]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["employer", "jobs"] });

  const publishMut = useMutation({
    mutationFn: (id: number) => jobsService.publish(id),
    onSuccess: () => { toast.success("Job published"); invalidate(); },
  });
  const closeMut = useMutation({
    mutationFn: (id: number) => jobsService.close(id),
    onSuccess: () => { toast.success("Job closed"); invalidate(); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => jobsService.remove(id),
    onSuccess: () => { toast.success("Job deleted"); invalidate(); },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your job postings.</p>
        </div>
        <Link
          to="/employer/jobs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <PlusCircle className="size-4" /> Post a job
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-xl border bg-card p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Job</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Applications</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobsQuery.isLoading && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">Loading…</td></tr>
            )}
            {!jobsQuery.isLoading && jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground"><Briefcase className="size-6" /></div>
                  <p className="mt-3 text-sm text-muted-foreground">No jobs match your filters.</p>
                </td>
              </tr>
            )}
            {jobs.map((j) => (
              <tr key={j.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link to="/employer/jobs/$jobId" params={{ jobId: String(j.id) }} className="font-semibold hover:text-primary">{j.title}</Link>
                  <div className="text-xs text-muted-foreground">{j.jobType} · {j.workMode}</div>
                </td>
                <td className="px-4 py-3"><JobStatusBadge status={j.jobStatus} /></td>
                <td className="px-4 py-3 tabular-nums">{j.applicationCount ?? 0}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(j.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to="/employer/jobs/$jobId" params={{ jobId: String(j.id) }}>
                      <Button variant="ghost" size="icon" aria-label="View"><Eye className="size-4" /></Button>
                    </Link>
                    <Link to="/employer/jobs/$jobId/edit" params={{ jobId: String(j.id) }}>
                      <Button variant="ghost" size="icon" aria-label="Edit"><Edit className="size-4" /></Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {j.jobStatus !== JobStatus.OPEN && (
                          <DropdownMenuItem onClick={() => publishMut.mutate(j.id)}>
                            <CheckCircle2 className="mr-2 size-4" /> Publish
                          </DropdownMenuItem>
                        )}
                        {j.jobStatus === JobStatus.OPEN && (
                          <DropdownMenuItem onClick={() => closeMut.mutate(j.id)}>
                            <XCircle className="mr-2 size-4" /> Close
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            if (confirm(`Delete "${j.title}"?`)) deleteMut.mutate(j.id);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
