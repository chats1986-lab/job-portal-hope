import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, BadgeCheck, MapPin, Briefcase, Users, Building2, ArrowRight } from "lucide-react";
import placeholder from "@/assets/placeholder.avif";
import type { JobResponse } from "@/types";
import { SkillBadge, StatusBadge } from "@/components/atoms/Badges";
import { SalaryBadge } from "@/components/atoms/SalaryBadge";
import { Button } from "@/components/ui/button";
import { timeAgo, humanizeEnum, formatJobLocation } from "@/lib/format";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { jobsService } from "@/lib/services/jobs.service";
import { toast } from "sonner";

export function JobCard({ job }: { job: JobResponse }) {
  const [isSaved, setIsSaved] = useState(false);
  const [imgError, setImgError] = useState(false);

  const navigate = useNavigate();
  const company = job.company;
  const verified = company?.companyStatus === "ACTIVE";
  const skills = (job.jobSkills ?? []).slice(0, 5);
  const location = formatJobLocation({
    city: job.city,
    state: job.state,
    country: job.country,
    workMode: job.workMode,
  });

  const { data: isJobSaved } = useQuery({
    queryKey: ["job-saved", job.id],
    queryFn: () => jobsService.isJobSaved(job.id.toString()),
    enabled: !!job.id,
  });

  useEffect(() => {
    if (isJobSaved !== undefined) {
      setIsSaved(isJobSaved);
    }
  }, [isJobSaved]);

  const saveMutation = useMutation({
    mutationFn: () => jobsService.saveJob(job.id.toString()),
    onSuccess: () => {
      setIsSaved(true);
      toast.success("Job saved");
    }
  })

  const unsaveMutation = useMutation({
    mutationFn: () => jobsService.unsaveJob(job.id.toString()),
    onSuccess: () => {
      setIsSaved(false);
      toast.success("Job unsaved");
    }
  })

  const toggleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(isSaved){
      unsaveMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  }


  return (
    <Link
      to="/jobs/$jobId"
      params={{ jobId: String(job.id) }}
      className="group block rounded-xl border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="flex gap-4">
        <img
          src={imgError || !company?.logoUrl ? placeholder : company.logoUrl}
          alt={company?.name ?? "Company"}
          loading="lazy"
          width={56}
          height={56}
          className="size-14 rounded-lg object-cover"
          onError={() => setImgError(true)}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
                {job.title}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="size-3.5" />
                <span className="font-medium text-foreground">{company?.name ?? "Company"}</span>
                {verified && <BadgeCheck className="size-4 text-info" />}
                {company?.industryType && (
                  <>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="uppercase tracking-wide">{humanizeEnum(company.industryType)}</span>
                  </>
                )}
                {company?.companySize && (
                  <>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="uppercase tracking-wide">{humanizeEnum(company.companySize)}</span>
                  </>
                )}
              </div>
              {company?.tagline && (
                <p className="mt-0.5 text-xs italic text-muted-foreground">{company.tagline}</p>
              )}
            </div>
            <button
              type="button"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
              aria-label="Save job"
              onClick={toggleSave}
            >
              <Bookmark className={`size-5 ${isSaved ? "text-primary fill-primary" : ""}`} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="size-3.5" />
              {humanizeEnum(job.jobType)}
            </span>
            <SalaryBadge min={job.minSalary} max={job.maxSalary} />
            <span className="text-xs">Posted {timeAgo(job.publishedAt ?? job.createdAt)}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <StatusBadge status={job.jobStatus} />
            <SkillBadge>{humanizeEnum(job.workMode)}</SkillBadge>
            <SkillBadge>{humanizeEnum(job.experienceLevel)}</SkillBadge>
            {skills.map((s) => (
              <SkillBadge key={s.id}>{s.skillName}</SkillBadge>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <Users className="size-3.5" /> {job.applicationCount ?? 0} applicants
              </span>
              {job.openings != null && <span>· {job.openings} openings</span>}
            </div>
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate({ to: "/jobs/$jobId", params: { jobId: String(job.id) } });
              }}
              className="h-8 rounded-lg"
            >
              
              View <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
