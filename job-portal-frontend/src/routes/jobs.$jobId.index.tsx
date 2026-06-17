import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  Briefcase,
  Calendar,
  DollarSign,
  Eye,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import placeholder from "@/assets/placeholder.avif";
import { EmptyState } from "@/components/molecules/EmptyState";
import { AppLayout } from "@/components/templates/AppLayout";
import { SkillBadge, StatusBadge } from "@/components/atoms/Badges";
import { Button } from "@/components/ui/button";
import { jobsService } from "@/lib/services/jobs.service";
import { savedJobsService } from "@/lib/services/saved-jobs.service";
import { formatDate, formatJobLocation, formatSalary, humanizeEnum, timeAgo } from "@/lib/format";
import { useAuth } from "@/lib/auth/context";
import { ApiError } from "@/lib/api/client";

export const Route = createFileRoute("/jobs/$jobId/")({
  loader: async ({ params }) => {
    try {
      const job = await jobsService.getById(params.jobId);
      if (!job) throw notFound();
      return { job, jobId: Number(params.jobId), loadError: null as string | null };
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) throw notFound();
      return {
        job: null,
        jobId: Number(params.jobId),
        loadError: "Job details are temporarily unavailable. Please try again once the backend is reachable.",
      };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.job?.title ?? "Job"} — HireMe` },
      { name: "description", content: loaderData?.job?.description?.slice(0, 160) ?? "Job details" },
    ],
  }),
  component: JobDetailsPage,
});

function JobDetailsPage() {
  const { job, jobId, loadError } = Route.useLoaderData();
  const { isAuthenticated } = useAuth();
  const [imgError, setImgError] = useState(false);
  const qc = useQueryClient();

  if (!job) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Link to="/jobs" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to Jobs
          </Link>
          <EmptyState
            icon={Briefcase}
            title={`Job #${jobId}`}
            description={loadError ?? "This job could not be loaded right now."}
            action={<Link to="/jobs/$jobId/apply" params={{ jobId: String(jobId) }}><Button>Continue to Apply</Button></Link>}
          />
        </div>
      </AppLayout>
    );
  }

  const { data: isSaved } = useQuery({
    queryKey: ["saved-jobs", "check", job.id],
    queryFn: () => savedJobsService.isSaved(job.id),
    enabled: isAuthenticated,
  });

  const saveMutation = useMutation({
    mutationFn: () => savedJobsService.save({ jobId: job.id }),
    onSuccess: () => {
      toast.success("Job saved");
      qc.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save job"),
  });

  const company = job.company;
  const verified = company?.companyStatus === "ACTIVE";
  const location = formatJobLocation({
    city: job.city,
    state: job.state,
    country: job.country,
    workMode: job.workMode,
  });

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/jobs" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Jobs
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex gap-4">
                <img src={imgError || !company?.logoUrl ? placeholder : company.logoUrl} alt={company?.name ?? ""} width={64} height={64} className="size-16 rounded-lg object-cover" onError={() => setImgError(true)} />
                <div className="min-w-0 flex-1">
                  <h1 className="font-display text-3xl font-bold">{job.title}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{company?.name ?? "Company"}</span>
                    {verified && <BadgeCheck className="size-4 text-info" />}
                    {company?.industryType && (
                      <>
                        <span className="text-muted-foreground/60">·</span>
                        <span className="uppercase">{humanizeEnum(company.industryType)}</span>
                      </>
                    )}
                    {company?.companySize && (
                      <>
                        <span className="text-muted-foreground/60">·</span>
                        <span className="uppercase">{humanizeEnum(company.companySize)}</span>
                      </>
                    )}
                  </div>
                  {company?.tagline && <p className="mt-1 text-sm italic text-muted-foreground">{company.tagline}</p>}

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {location}</span>
                    <span className="inline-flex items-center gap-1"><Briefcase className="size-3.5" /> {humanizeEnum(job.jobType)}</span>
                    <span className="inline-flex items-center gap-1"><DollarSign className="size-3.5" /> {formatSalary(job.minSalary, job.maxSalary)}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" /> Posted {timeAgo(job.publishedAt ?? job.createdAt)}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <StatusBadge status={job.jobStatus} />
                    <SkillBadge>{humanizeEnum(job.workMode)}</SkillBadge>
                    <SkillBadge>{humanizeEnum(job.experienceLevel)}</SkillBadge>
                    {(job.jobSkills ?? []).map((s: { id: number; skillName: string }) => (
                      <SkillBadge key={s.id}>{s.skillName}</SkillBadge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Section title="About the Role">
              <p className="whitespace-pre-line text-sm text-muted-foreground">{job.description}</p>
            </Section>

            {job.responsibilities && (
              <Section title="Responsibilities">
                <p className="whitespace-pre-line text-sm text-muted-foreground">{job.responsibilities}</p>
              </Section>
            )}

            {job.requirements && (
              <Section title="Requirements">
                <p className="whitespace-pre-line text-sm text-muted-foreground">{job.requirements}</p>
              </Section>
            )}

            {job.benefits && (
              <Section title="Benefits">
                <p className="whitespace-pre-line text-sm text-muted-foreground">{job.benefits}</p>
              </Section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border bg-card p-5">
              <Link to="/jobs/$jobId/apply" params={{ jobId: String(job.id) }}>
                <Button className="h-12 w-full rounded-xl text-base font-semibold">Apply Now</Button>
              </Link>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={!isAuthenticated || saveMutation.isPending || isSaved === true}
                  onClick={() => saveMutation.mutate()}
                >
                  <Bookmark className="size-4" /> {isSaved ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="icon"><Share2 className="size-4" /></Button>
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                <Row label="Job Type" value={humanizeEnum(job.jobType)} />
                <Row label="Work Mode" value={humanizeEnum(job.workMode)} />
                <Row label="Experience" value={humanizeEnum(job.experienceLevel)} />
                <Row label="Salary" value={formatSalary(job.minSalary, job.maxSalary)} />
                {job.openings != null && <Row label="Openings" value={String(job.openings)} />}
                {job.applicationDeadline && <Row label="Deadline" value={formatDate(job.applicationDeadline)} />}
                <Row label="Posted" value={timeAgo(job.publishedAt ?? job.createdAt)} />
              </dl>

              <div className="mt-5 flex items-center gap-4 border-t pt-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> {job.applicationCount ?? 0} applicants</span>
                <span className="inline-flex items-center gap-1"><Eye className="size-3.5" /> {job.viewCount ?? 0} views</span>
              </div>
            </div>

            {job.jobTags && job.jobTags.length > 0 && (
              <div className="rounded-xl border bg-card p-5">
                <h3 className="mb-3 font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.jobTags.map((t: { id: number; name: string }) => <SkillBadge key={t.id}>{t.name}</SkillBadge>)}
                </div>
              </div>
            )}

            {job.address && (
              <div className="rounded-xl border bg-card p-5">
                <h3 className="mb-2 font-semibold">Location Details</h3>
                <p className="text-sm text-muted-foreground">{job.address}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="mb-3 font-display text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}