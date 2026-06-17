import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft, Edit, Trash2, CheckCircle2, XCircle, MapPin, DollarSign, Users, Eye, Calendar,
} from "lucide-react";
import { jobsService } from "@/lib/services/jobs.service";
import { applicationsService } from "@/lib/services/applications.service";
import { JobStatus } from "@/types";
import { JobStatusBadge } from "@/components/employer/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_employer/employer/jobs/$jobId/")({
  head: () => ({ meta: [{ title: "Job — Employer" }] }),
  component: EmployerJobDetail,
});

function EmployerJobDetail() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const jobQuery = useQuery({
    queryKey: ["employer", "job", jobId],
    queryFn: () => jobsService.getById(jobId),
  });
  const appsQuery = useQuery({
    queryKey: ["employer", "applications", "job", jobId],
    queryFn: () => applicationsService.forCompany({ jobId: Number(jobId) }),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["employer"] });
  const publishMut = useMutation({
    mutationFn: () => jobsService.publish(jobId),
    onSuccess: () => { toast.success("Job published"); invalidate(); },
  });
  const closeMut = useMutation({
    mutationFn: () => jobsService.close(jobId),
    onSuccess: () => { toast.success("Job closed"); invalidate(); },
  });
  const deleteMut = useMutation({
    mutationFn: () => jobsService.remove(jobId),
    onSuccess: () => { toast.success("Job deleted"); navigate({ to: "/employer/jobs" }); },
  });

  const job = jobQuery.data;
  if (jobQuery.isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!job) return <div className="text-sm text-muted-foreground">Job not found.</div>;
  const apps = appsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <Link to="/employer/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to jobs
      </Link>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <JobStatusBadge status={job.jobStatus} />
              <span className="text-xs text-muted-foreground">{job.jobType} · {job.workMode}</span>
            </div>
            <h1 className="font-display text-2xl font-bold">{job.title}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {(job.city || job.country) && <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{[job.city, job.country].filter(Boolean).join(", ")}</span>}
              {(job.minSalary || job.maxSalary) && <span className="inline-flex items-center gap-1"><DollarSign className="size-3" />{job.minSalary ?? "?"}–{job.maxSalary ?? "?"}</span>}
              <span className="inline-flex items-center gap-1"><Users className="size-3" />{apps.length} apps</span>
              <span className="inline-flex items-center gap-1"><Eye className="size-3" />{job.viewCount ?? 0} views</span>
              <span className="inline-flex items-center gap-1"><Calendar className="size-3" />Created {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/employer/jobs/$jobId/edit" params={{ jobId }}>
              <Button variant="outline"><Edit className="mr-2 size-4" /> Edit</Button>
            </Link>
            {job.jobStatus !== JobStatus.OPEN ? (
              <Button onClick={() => publishMut.mutate()} disabled={publishMut.isPending}>
                <CheckCircle2 className="mr-2 size-4" /> Publish
              </Button>
            ) : (
              <Button variant="outline" onClick={() => closeMut.mutate()} disabled={closeMut.isPending}>
                <XCircle className="mr-2 size-4" /> Close
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => confirm(`Delete "${job.title}"?`) && deleteMut.mutate()}
              disabled={deleteMut.isPending}
            >
              <Trash2 className="mr-2 size-4" /> Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Description">{job.description}</Section>
          {job.requirements && <Section title="Requirements">{job.requirements}</Section>}
          {job.responsibilities && <Section title="Responsibilities">{job.responsibilities}</Section>}
          {job.benefits && <Section title="Benefits">{job.benefits}</Section>}
          {job.jobSkills && job.jobSkills.length > 0 && (
            <section className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="mb-3 font-display text-base font-bold">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.jobSkills.map((s) => (
                  <span key={s.id} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{s.skillName}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="font-display text-base font-bold">Applications ({apps.length})</h3>
          {apps.slice(0, 8).map((a) => (
            <Link
              key={a.id}
              to="/employer/applications/$applicationId"
              params={{ applicationId: String(a.id) }}
              className="block rounded-lg border p-3 hover:bg-muted/50"
            >
              <div className="text-sm font-semibold">{a.candidate?.fullName ?? "Candidate"}</div>
              <div className="mt-1 text-xs text-muted-foreground">{a.status} · {new Date(a.appliedAt).toLocaleDateString()}</div>
            </Link>
          ))}
          {apps.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
          <Link to="/employer/applications" className="block pt-2 text-sm font-medium text-primary hover:underline">View all applications →</Link>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h3 className="mb-3 font-display text-base font-bold">{title}</h3>
      <div className="whitespace-pre-line text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}
