import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { blockEmployer } from "@/lib/auth/guards";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  MapPin,
  Copy,
  RotateCcw,
  Eye,
  CheckCircle2,
  Calendar,
  DollarSign,
  Upload,
  FileText,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import placeholder from "@/assets/placeholder.avif";
import { AppLayout } from "@/components/templates/AppLayout";
import { Stepper } from "@/components/molecules/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkillBadge } from "@/components/atoms/Badges";
import { jobsService } from "@/lib/services/jobs.service";
import { resumesService } from "@/lib/services/resumes.service";
import { applicationsService } from "@/lib/services/applications.service";
import { generateCoverLetter } from "@/lib/cover-letter.functions";
import { useAuth } from "@/lib/auth/context";
import { ApiError } from "@/lib/api/client";
import { formatJobLocation, humanizeEnum } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jobs/$jobId/apply")({
  beforeLoad: () => blockEmployer(),
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
        loadError: "Job details are temporarily unavailable, but you can still continue your application.",
      };
    }
  },
  head: ({ loaderData }) => ({ meta: [{ title: `Apply — ${loaderData?.job?.title ?? "Job"} — HireMe` }] }),
  component: ApplyPage,
});

const STEPS = [
  { label: "Resume", description: "Choose your resume" },
  { label: "Cover Letter", description: "Write your cover letter" },
  { label: "Details", description: "Salary & availability" },
  { label: "Review", description: "Review and submit" },
];

function ApplyPage() {
  const { job, jobId, loadError } = Route.useLoaderData();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [salary, setSalary] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loomUrl, setLoomUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isUrl = (v: string) => {
    if (!v) return true;
    try {
      const u = new URL(v);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };
  const urlsValid = isUrl(githubUrl) && isUrl(linkedinUrl) && isUrl(loomUrl);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/auth/login" });
    }
  }, [isAuthenticated, navigate]);

  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => resumesService.list(),
    enabled: isAuthenticated,
  });
  const selectedResume = resumes?.find((r) => r.id === resumeId);

  const submit = useMutation({
    mutationFn: () => {
      if (resumeId == null && !uploadedResume) throw new Error("Please select or upload a resume");
      if (!urlsValid) throw new Error("One of the additional links is not a valid URL");
      const links = [
        githubUrl && `GitHub: ${githubUrl}`,
        linkedinUrl && `LinkedIn: ${linkedinUrl}`,
        loomUrl && `Loom: ${loomUrl}`,
      ].filter(Boolean);
      const finalLetter = links.length
        ? `${coverLetter}${coverLetter ? "\n\n" : ""}— Links —\n${links.join("\n")}`
        : coverLetter;
      return applicationsService.create({
        jobId: job?.id ?? jobId,
        resumeId: resumeId as number,
        coverLetter: finalLetter || undefined,
        expectedSalary: salary ? Number(salary) : undefined,
        availableFrom: availableFrom || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      setSubmitted(true);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not submit application"),
  });

  const company = job?.company;
  const location = job
    ? formatJobLocation({ city: job.city, state: job.state, country: job.country, workMode: job.workMode })
    : "Location unavailable";
  const jobTitle = job?.title ?? `Job #${jobId}`;

  const aiGen = useMutation({
    mutationFn: () =>
      generateCoverLetter({
        jobTitle: jobTitle,
        companyName: company?.name,
        jobDescription: job?.description ?? undefined,
        resumeSummary: selectedResume?.summary ?? undefined,
        candidateName: user?.fullName ?? "",
      }),
    onSuccess: (res) => {
      setCoverLetter(res.coverLetter);
      toast.success("Cover letter generated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not generate cover letter"),
  });

  if (submitted) return <SubmittedView jobTitle={jobTitle} />;

  const canNext =
    (step === 0 && (resumeId != null || uploadedResume != null)) ||
    step === 1 ||
    step === 2 ||
    step === 3;

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/jobs/$jobId" params={{ jobId: String(job?.id ?? jobId) }} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Job
        </Link>

        <div className="mb-8 rounded-xl border bg-card p-6">
          <div className="flex gap-4">
            <img src={imgError || !company?.logoUrl ? placeholder : company.logoUrl} alt="" width={64} height={64} className="size-16 rounded-lg object-cover" onError={() => setImgError(true)} />
            <div>
              <h1 className="font-display text-2xl font-bold">Apply for {jobTitle}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{company?.name ?? "Company"}</span>
                {company?.companyStatus === "ACTIVE" && <BadgeCheck className="size-4 text-info" />}
                <span>·</span>
                <MapPin className="size-3.5" />
                {location}
              </div>
              {loadError && <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>}
            </div>
          </div>
        </div>

        <div className="mb-10">
          <Stepper steps={STEPS} current={step} />
        </div>

        {step === 0 && (
          <StepCard title="Select Resume" description="Choose a saved resume or upload a new one">
            <div className="space-y-3">
              {resumes && resumes.length > 0 && resumes.map((r) => (
                <label
                  key={r.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-xl border bg-card p-4 transition-colors",
                    resumeId === r.id && "border-primary ring-2 ring-primary/20",
                  )}
                >
                  <input
                    type="radio"
                    name="resume"
                    checked={resumeId === r.id}
                    onChange={() => { setResumeId(r.id); setUploadedResume(null); }}
                  />
                  <div className="grid size-10 place-items-center rounded-lg bg-info-soft text-primary">📄</div>
                  <div className="flex-1">
                    <div className="font-semibold">{r.title}</div>
                    <div className="mt-1 flex gap-1.5">
                      <SkillBadge className="bg-info-soft text-info">{humanizeEnum(r.resumeTemplate)}</SkillBadge>
                      {r.isDefault && <SkillBadge className="bg-success-soft text-success">Default</SkillBadge>}
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={(e) => e.preventDefault()}>
                    <Eye className="size-4" /> Preview
                  </Button>
                </label>
              ))}

              {/* Upload resume option */}
              {uploadedResume ? (
                <div className={cn(
                  "flex items-center gap-4 rounded-xl border bg-card p-4",
                  !resumeId && "border-primary ring-2 ring-primary/20",
                )}>
                  <div className="grid size-10 place-items-center rounded-lg bg-success-soft text-success">
                    <FileText className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-semibold">{uploadedResume.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(uploadedResume.size / 1024).toFixed(1)} KB · Uploaded
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setUploadedResume(null)}>
                    <X className="size-4" /> Remove
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-muted/30 p-6 text-center transition-colors hover:bg-muted/50">
                  <Upload className="size-6 text-muted-foreground" />
                  <div className="text-sm font-medium">Upload a resume</div>
                  <div className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 5MB</div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (f.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
                      setUploadedResume(f);
                      setResumeId(null);
                      toast.success("Resume uploaded");
                    }}
                  />
                </label>
              )}

              {(!resumes || resumes.length === 0) && !uploadedResume && (
                <p className="text-center text-xs text-muted-foreground">
                  No saved resumes yet. Upload one above or{" "}
                  <Link to="/resume-builder" className="font-medium text-primary hover:underline">create one</Link>.
                </p>
              )}
            </div>
          </StepCard>
        )}

        {step === 1 && (
          <StepCard title="Cover Letter" description="Optional — tell the employer why you're a great fit, or skip this step">
            <div className="rounded-xl border bg-card p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-semibold">Your Cover Letter</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    disabled={aiGen.isPending}
                    onClick={() => aiGen.mutate()}
                  >
                    <Sparkles className="size-3.5" />
                    {aiGen.isPending ? "Generating…" : "Write with AI"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(coverLetter); toast.success("Copied"); }}>
                    <Copy className="size-3.5" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCoverLetter("")}>
                    <RotateCcw className="size-3.5" /> Clear
                  </Button>
                </div>
              </div>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={10}
                placeholder={aiGen.isPending ? "AI is drafting your cover letter…" : "Write your cover letter here, or click 'Write with AI' to draft one for you…"}
                className="resize-none"
                disabled={aiGen.isPending}
              />
              <p className="mt-2 text-xs text-muted-foreground">{coverLetter.length} characters · optional</p>
            </div>
          </StepCard>
        )}

        {step === 2 && (
          <StepCard title="Additional Details" description="Provide salary expectations and availability (both optional)">
            <div className="rounded-xl border bg-card p-5">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="salary">Expected Salary</Label>
                  <div className="relative mt-2">
                    <DollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="salary" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 80000" className="pl-9" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="from">Available From</Label>
                  <div className="relative mt-2">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="from" type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      className="mt-2"
                      placeholder="https://github.com/username"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                    {!isUrl(githubUrl) && (
                      <p className="mt-1 text-xs text-destructive">Enter a valid URL</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      className="mt-2"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                    {!isUrl(linkedinUrl) && (
                      <p className="mt-1 text-xs text-destructive">Enter a valid URL</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="loom">Loom Video URL</Label>
                    <Input
                      id="loom"
                      className="mt-2"
                      placeholder="https://www.loom.com/share/..."
                      value={loomUrl}
                      onChange={(e) => setLoomUrl(e.target.value)}
                    />
                    {!isUrl(loomUrl) && (
                      <p className="mt-1 text-xs text-destructive">Enter a valid URL</p>
                    )}
                  </div>
                </div>
                <p className="rounded-md bg-info-soft px-3 py-2 text-xs text-info">
                  Note: links are appended to your cover letter when submitting.
                </p>
              </div>
            </div>
          </StepCard>
        )}

        {step === 3 && (
          <StepCard title="Review Your Application" description="Please review all information before submitting">
            <ReviewSection title="Position">
              <ReviewRow label="Job Title" value={jobTitle} />
              <ReviewRow label="Company" value={company?.name ?? "—"} />
              <ReviewRow label="Location" value={location} />
            </ReviewSection>

            <ReviewSection title="Resume">
              <div className="rounded-lg bg-muted px-4 py-3 text-sm font-medium">{selectedResume?.title ?? "—"}</div>
            </ReviewSection>

            <ReviewSection title="Cover Letter">
              <div className="whitespace-pre-line rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                {coverLetter || "—"}
              </div>
            </ReviewSection>

            {(salary || availableFrom) && (
              <ReviewSection title="Additional Details">
                {salary && <ReviewRow label="Expected Salary" value={`$${Number(salary).toLocaleString("en-US")}`} />}
                {availableFrom && <ReviewRow label="Available From" value={availableFrom} />}
              </ReviewSection>
            )}
          </StepCard>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="size-4" /> Previous
          </Button>
          {step < STEPS.length - 1 ? (
            <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              Next <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button disabled={submit.isPending} onClick={() => submit.mutate()}>
              {submit.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function StepCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}
function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function SubmittedView({ jobTitle }: { jobTitle: string }) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-10 text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-success-soft">
            <CheckCircle2 className="size-10 text-success" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold">Application Submitted!</h1>
          <p className="mt-2 text-muted-foreground">
            Your application for <span className="font-semibold text-foreground">{jobTitle}</span> has been successfully submitted.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/applications"><Button>View My Applications</Button></Link>
            <Link to="/jobs"><Button variant="outline">Browse More Jobs</Button></Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
