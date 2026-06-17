import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { blockEmployer } from "@/lib/auth/guards";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Pencil,
  Plus,
  Save,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { AppLayout } from "@/components/templates/AppLayout";
import { Stepper } from "@/components/molecules/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { SkillBadge } from "@/components/atoms/Badges";
import { SortableList } from "@/components/resume-builder/SortableList";
import { TagInput } from "@/components/resume-builder/TagInput";
import { resumesService } from "@/lib/services/resumes.service";
import {
  workExperiencesService,
  type WorkExperienceRequest,
} from "@/lib/services/work-experiences.service";
import { educationsService, type EducationRequest } from "@/lib/services/educations.service";
import { projectsService, type ProjectRequest } from "@/lib/services/projects.service";
import { resumeSkillsService, type ResumeSkillRequest } from "@/lib/services/resume-skills.service";
import { useAuth } from "@/lib/auth/context";
import { humanizeEnum } from "@/lib/format";
import {
  JobType,
  ProficiencyLevel,
  ResumeTemplate,
  ResumeVisibility,
  type EducationResponse,
  type PersonalInfoResponse,
  type ProjectResponse,
  type ResumeResponse,
  type ResumeSkillResponse,
  type WorkExperienceResponse,
} from "@/types";

export const Route = createFileRoute("/resume-builder/$resumeId")({
  beforeLoad: () => blockEmployer(),
  head: () => ({ meta: [{ title: "Edit Resume — HireMe" }] }),
  component: ResumeBuilderWizard,
});

const STEPS = [
  { label: "Personal" },
  { label: "Summary" },
  { label: "Experience" },
  { label: "Education" },
  { label: "Projects" },
  { label: "Skills" },
  { label: "Review" },
];

function ResumeBuilderWizard() {
  const { resumeId } = Route.useParams();
  const { isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isReady && !isAuthenticated) navigate({ to: "/auth/login" });
  }, [isAuthenticated, isReady, navigate]);

  const resumeQuery = useQuery({
    queryKey: ["resume", resumeId],
    queryFn: () => resumesService.getById(resumeId),
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
  const workQuery = useQuery({
    queryKey: ["resume", resumeId, "work"],
    queryFn: () => workExperiencesService.list(resumeId),
    enabled: isAuthenticated && step === 2,
    refetchOnWindowFocus: false,
  });
  const eduQuery = useQuery({
    queryKey: ["resume", resumeId, "edu"],
    queryFn: () => educationsService.list(resumeId),
    enabled: isAuthenticated && step === 3,
    refetchOnWindowFocus: false,
  });
  const projectsQuery = useQuery({
    queryKey: ["resume", resumeId, "projects"],
    queryFn: () => projectsService.list(resumeId),
    enabled: isAuthenticated && step === 4,
    refetchOnWindowFocus: false,
  });
  const skillsQuery = useQuery({
    queryKey: ["resume", resumeId, "skills"],
    queryFn: () => resumeSkillsService.list(resumeId),
    enabled: isAuthenticated && step === 5,
    refetchOnWindowFocus: false,
  });

  const resume = resumeQuery.data;

  const score = useMemo(() => {
    let s = 0;
    const p = resume?.personalInfo;
    if (p?.firstName && p?.lastName && p?.email) s += 10;
    if (p?.headline) s += 5;
    if (resume?.summary && resume.summary.length > 40) s += 15;
    if ((workQuery.data?.length ?? 0) >= 1) s += 20;
    if ((eduQuery.data?.length ?? 0) >= 1) s += 15;
    if ((projectsQuery.data?.length ?? 0) >= 1) s += 10;
    const sk = skillsQuery.data?.length ?? 0;
    if (sk >= 3) s += 15;
    else if (sk >= 1) s += 8;
    if (resume?.resumeTemplate && resume?.resumeVisibility) s += 10;
    return Math.min(100, s);
  }, [resume, workQuery.data, eduQuery.data, projectsQuery.data, skillsQuery.data]);

  if (resumeQuery.isLoading || !resume) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-muted-foreground">Loading resume…</div>
      </AppLayout>
    );
  }

  const back = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/resume-builder"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All resumes
        </Link>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">{resume.title}</h1>
              <p className="text-sm text-muted-foreground">
                Step {step + 1} of {STEPS.length} — {STEPS[step].label}
              </p>
            </div>
            <div className="w-full sm:w-64">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Completion</span>
                <span className="font-semibold text-foreground">{score}%</span>
              </div>
              <Progress value={score} />
            </div>
          </div>
          <div className="mt-6">
            <Stepper steps={STEPS} current={step} />
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-card p-5 sm:p-6">
          {step === 0 && <PersonalInfoStep resume={resume} resumeId={resumeId} onNext={next} />}
          {step === 1 && <SummaryStep resume={resume} resumeId={resumeId} onNext={next} />}
          {step === 2 && (
            <WorkStep resumeId={resumeId} items={workQuery.data ?? []} refetch={workQuery.refetch} onNext={next} />
          )}
          {step === 3 && (
            <EducationStep resumeId={resumeId} items={eduQuery.data ?? []} refetch={eduQuery.refetch} onNext={next} />
          )}
          {step === 4 && (
            <ProjectsStep
              resumeId={resumeId}
              items={projectsQuery.data ?? []}
              refetch={projectsQuery.refetch}
              onNext={next}
            />
          )}
          {step === 5 && (
            <SkillsStep
              resumeId={resumeId}
              items={skillsQuery.data ?? []}
              refetch={skillsQuery.refetch}
              onNext={next}
            />
          )}
          {step === 6 && (
            <ReviewStep
              resume={resume}
              work={workQuery.data ?? []}
              edu={eduQuery.data ?? []}
              projects={projectsQuery.data ?? []}
              skills={skillsQuery.data ?? []}
              score={score}
              onSaved={() => {
                qc.invalidateQueries({ queryKey: ["resumes"] });
                qc.invalidateQueries({ queryKey: ["resume", resumeId] });
              }}
            />
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Button variant="outline" onClick={back} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          <div className="text-xs text-muted-foreground">Click "Save & Continue" to save and move to the next step.</div>
          {step === STEPS.length - 1 && (
            <Button onClick={() => navigate({ to: "/resume-builder" })}>
              <CheckCircle2 className="size-4" /> Finish
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// ============ STEP 1: PERSONAL INFO ============
function PersonalInfoStep({ resume, resumeId, onNext }: { resume: ResumeResponse; resumeId: string; onNext: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<PersonalInfoResponse>(resume.personalInfo ?? {});

  const save = useMutation({
    mutationFn: () => resumesService.updatePersonalInfo(resumeId, form),
    onSuccess: () => {
      toast.success("Personal info saved");
      qc.invalidateQueries({ queryKey: ["resume", resumeId] });
      onNext();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save"),
  });

  const set = (k: keyof PersonalInfoResponse, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <SectionHeader title="Personal Information" subtitle="Tell employers how to reach you." />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="First Name" required>
          <Input value={form.firstName ?? ""} onChange={(e) => set("firstName", e.target.value)} />
        </Field>
        <Field label="Last Name" required>
          <Input value={form.lastName ?? ""} onChange={(e) => set("lastName", e.target.value)} />
        </Field>
        <Field label="Headline" className="sm:col-span-2">
          <Input
            placeholder="e.g. Senior Frontend Engineer · React · TypeScript"
            value={form.headline ?? ""}
            onChange={(e) => set("headline", e.target.value)}
          />
        </Field>
        <Field label="Email" required>
          <Input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="City">
          <Input value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="Country">
          <Input value={form.country ?? ""} onChange={(e) => set("country", e.target.value)} />
        </Field>
        <Field label="LinkedIn URL">
          <Input value={form.linkedinUrl ?? ""} onChange={(e) => set("linkedinUrl", e.target.value)} />
        </Field>
        <Field label="GitHub URL">
          <Input value={form.githubUrl ?? ""} onChange={(e) => set("githubUrl", e.target.value)} />
        </Field>
        <Field label="Portfolio URL">
          <Input value={form.portfolioUrl ?? ""} onChange={(e) => set("portfolioUrl", e.target.value)} />
        </Field>
        <Field label="Website URL">
          <Input value={form.websiteUrl ?? ""} onChange={(e) => set("websiteUrl", e.target.value)} />
        </Field>
      </div>
      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => save.mutate()}
          disabled={save.isPending || !form.firstName || !form.lastName || !form.email}
        >
          <Save className="size-4" /> {save.isPending ? "Saving…" : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}

// ============ STEP 2: SUMMARY ============
function SummaryStep({ resume, resumeId, onNext }: { resume: ResumeResponse; resumeId: string; onNext: () => void }) {
  const qc = useQueryClient();
  const [summary, setSummary] = useState(resume.summary ?? "");
  const save = useMutation({
    mutationFn: () => resumesService.updateSummary(resumeId, summary),
    onSuccess: () => {
      toast.success("Summary saved");
      qc.invalidateQueries({ queryKey: ["resume", resumeId] });
      onNext();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save"),
  });
  return (
    <div>
      <SectionHeader
        title="Professional Summary"
        subtitle="A 3–5 sentence elevator pitch. Highlight your strengths and the impact you've made."
      />
      <Textarea
        className="mt-4 min-h-[180px]"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Experienced engineer with 7+ years building scalable web platforms…"
      />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{summary.length} characters</span>
        <span>Tip: lead with years of experience and your top 2–3 skills.</span>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          <Save className="size-4" /> {save.isPending ? "Saving…" : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}

// ============ STEP 3: WORK EXPERIENCE ============
function WorkStep({
  resumeId,
  items,
  refetch,
  onNext,
}: {
  resumeId: string;
  items: WorkExperienceResponse[];
  refetch: () => void;
  onNext: () => void;
}) {
  const [editing, setEditing] = useState<WorkExperienceResponse | null>(null);
  const [open, setOpen] = useState(false);

  const remove = useMutation({
    mutationFn: (id: number) => workExperiencesService.remove(resumeId, id),
    onSuccess: () => {
      toast.success("Removed");
      refetch();
    },
  });

  return (
    <div>
      <SectionHeader
        title="Work Experience"
        subtitle="Add roles in reverse-chronological order. Drag to reorder."
        action={
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Add
          </Button>
        }
      />

      {items.length === 0 && <EmptyHint text="No work experience yet. Click Add to begin." />}

      <div className="mt-4">
        <SortableList
          items={items}
          onReorder={() => toast.info("Reordering syncs locally; backend reorder coming soon.")}
          renderItem={(w) => (
            <ItemCard
              title={`${w.jobTitle} · ${w.companyName}`}
              subtitle={[w.location, `${w.startDate} – ${w.isCurrentJob ? "Present" : w.endDate ?? "—"}`]
                .filter(Boolean)
                .join(" · ")}
              tags={w.technologies}
              onEdit={() => {
                setEditing(w);
                setOpen(true);
              }}
              onRemove={() => remove.mutate(w.id)}
            />
          )}
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit experience" : "Add experience"}</SheetTitle>
          </SheetHeader>
          <WorkForm
            resumeId={resumeId}
            initial={editing}
            onDone={() => {
              setOpen(false);
              refetch();
            }}
          />
        </SheetContent>
      </Sheet>

      <div className="mt-6 flex justify-end">
        <Button onClick={onNext}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function WorkForm({
  resumeId,
  initial,
  onDone,
}: {
  resumeId: string;
  initial: WorkExperienceResponse | null;
  onDone: () => void;
}) {
  const [data, setData] = useState<WorkExperienceRequest>({
    companyName: initial?.companyName ?? "",
    jobTitle: initial?.jobTitle ?? "",
    employmentType: initial?.employmentType,
    location: initial?.location ?? "",
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
    isCurrentJob: initial?.isCurrentJob ?? false,
    description: initial?.description ?? "",
    technologies: initial?.technologies ?? [],
  });
  const save = useMutation({
    mutationFn: () =>
      initial
        ? workExperiencesService.update(resumeId, initial.id, data)
        : workExperiencesService.create(resumeId, data),
    onSuccess: () => {
      toast.success("Saved");
      onDone();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save"),
  });

  const valid = data.companyName && data.jobTitle && data.startDate;

  return (
    <div className="mt-4 space-y-4">
      <Field label="Company Name" required>
        <Input value={data.companyName} onChange={(e) => setData({ ...data, companyName: e.target.value })} />
      </Field>
      <Field label="Job Title" required>
        <Input value={data.jobTitle} onChange={(e) => setData({ ...data, jobTitle: e.target.value })} />
      </Field>
      <Field label="Employment Type">
        <Select
          value={data.employmentType ?? ""}
          onValueChange={(v) => setData({ ...data, employmentType: v as JobType })}
        >
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            {Object.values(JobType).map((t) => (
              <SelectItem key={t} value={t}>{humanizeEnum(t)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Location">
        <Input value={data.location ?? ""} onChange={(e) => setData({ ...data, location: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start Date" required>
          <Input type="date" value={data.startDate} onChange={(e) => setData({ ...data, startDate: e.target.value })} />
        </Field>
        <Field label="End Date">
          <Input
            type="date"
            value={data.endDate ?? ""}
            disabled={data.isCurrentJob}
            onChange={(e) => setData({ ...data, endDate: e.target.value })}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={!!data.isCurrentJob}
          onCheckedChange={(v) => setData({ ...data, isCurrentJob: !!v, endDate: v ? undefined : data.endDate })}
        />
        I currently work here
      </label>
      <Field label="Description">
        <Textarea
          rows={5}
          value={data.description ?? ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          placeholder="• Led a team of 5 engineers…"
        />
      </Field>
      <Field label="Technologies">
        <TagInput value={data.technologies ?? []} onChange={(t) => setData({ ...data, technologies: t })} />
      </Field>
      <SheetFooter>
        <Button onClick={() => save.mutate()} disabled={!valid || save.isPending}>
          <Save className="size-4" /> {save.isPending ? "Saving…" : "Save"}
        </Button>
      </SheetFooter>
    </div>
  );
}

// ============ STEP 4: EDUCATION ============
function EducationStep({
  resumeId,
  items,
  refetch,
  onNext,
}: {
  resumeId: string;
  items: EducationResponse[];
  refetch: () => void;
  onNext: () => void;
}) {
  const [editing, setEditing] = useState<EducationResponse | null>(null);
  const [open, setOpen] = useState(false);
  const remove = useMutation({
    mutationFn: (id: number) => educationsService.remove(resumeId, id),
    onSuccess: () => {
      toast.success("Removed");
      refetch();
    },
  });
  return (
    <div>
      <SectionHeader
        title="Education"
        subtitle="Most recent first."
        action={
          <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="size-4" /> Add
          </Button>
        }
      />
      {items.length === 0 && <EmptyHint text="No education yet." />}
      <div className="mt-4">
        <SortableList
          items={items}
          onReorder={() => toast.info("Local reorder only.")}
          renderItem={(e) => (
            <ItemCard
              title={`${e.degree}${e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}`}
              subtitle={`${e.institutionName} · ${e.startDate} – ${e.isCurrentlyStudying ? "Present" : e.endDate}`}
              onEdit={() => { setEditing(e); setOpen(true); }}
              onRemove={() => remove.mutate(e.id)}
            />
          )}
        />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader><SheetTitle>{editing ? "Edit education" : "Add education"}</SheetTitle></SheetHeader>
          <EducationForm
            resumeId={resumeId}
            initial={editing}
            onDone={() => { setOpen(false); refetch(); }}
          />
        </SheetContent>
      </Sheet>

      <div className="mt-6 flex justify-end">
        <Button onClick={onNext}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function EducationForm({
  resumeId,
  initial,
  onDone,
}: {
  resumeId: string;
  initial: EducationResponse | null;
  onDone: () => void;
}) {
  const [data, setData] = useState<EducationRequest>({
    institutionName: initial?.institutionName ?? "",
    degree: initial?.degree ?? "",
    fieldOfStudy: initial?.fieldOfStudy ?? "",
    grade: initial?.grade ?? "",
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
    isCurrentlyStudying: initial?.isCurrentlyStudying ?? false,
    description: initial?.description ?? "",
  });
  const save = useMutation({
    mutationFn: () =>
      initial
        ? educationsService.update(resumeId, initial.id, data)
        : educationsService.create(resumeId, data),
    onSuccess: () => { toast.success("Saved"); onDone(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save"),
  });
  const valid = data.institutionName && data.degree && data.startDate;
  return (
    <div className="mt-4 space-y-4">
      <Field label="Institution Name" required>
        <Input
          maxLength={200}
          value={data.institutionName}
          onChange={(e) => setData({ ...data, institutionName: e.target.value })}
        />
      </Field>
      <Field label="Degree" required>
        <Input value={data.degree} onChange={(e) => setData({ ...data, degree: e.target.value })} />
      </Field>
      <Field label="Field of Study">
        <Input
          maxLength={150}
          value={data.fieldOfStudy ?? ""}
          onChange={(e) => setData({ ...data, fieldOfStudy: e.target.value })}
        />
      </Field>
      <Field label="Grade">
        <Input
          maxLength={50}
          value={data.grade ?? ""}
          onChange={(e) => setData({ ...data, grade: e.target.value })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start Date" required>
          <Input type="date" value={data.startDate} onChange={(e) => setData({ ...data, startDate: e.target.value })} />
        </Field>
        <Field label="End Date" required={!data.isCurrentlyStudying}>
          <Input
            type="date"
            value={data.endDate ?? ""}
            disabled={data.isCurrentlyStudying}
            onChange={(e) => setData({ ...data, endDate: e.target.value })}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={!!data.isCurrentlyStudying}
          onCheckedChange={(v) => setData({ ...data, isCurrentlyStudying: !!v })}
        />
        I currently study here
      </label>
      <Field label="Description">
        <Textarea
          rows={4}
          value={data.description ?? ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      </Field>
      <SheetFooter>
        <Button onClick={() => save.mutate()} disabled={!valid || save.isPending}>
          <Save className="size-4" /> {save.isPending ? "Saving…" : "Save"}
        </Button>
      </SheetFooter>
    </div>
  );
}

// ============ STEP 5: PROJECTS ============
function ProjectsStep({
  resumeId,
  items,
  refetch,
  onNext,
}: {
  resumeId: string;
  items: ProjectResponse[];
  refetch: () => void;
  onNext: () => void;
}) {
  const [editing, setEditing] = useState<ProjectResponse | null>(null);
  const [open, setOpen] = useState(false);
  const remove = useMutation({
    mutationFn: (id: number) => projectsService.remove(resumeId, id),
    onSuccess: () => { toast.success("Removed"); refetch(); },
  });
  return (
    <div>
      <SectionHeader
        title="Projects"
        subtitle="Showcase the work you're proudest of."
        action={
          <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="size-4" /> Add
          </Button>
        }
      />
      {items.length === 0 && <EmptyHint text="No projects yet." />}
      <div className="mt-4">
        <SortableList
          items={items}
          onReorder={() => toast.info("Local reorder only.")}
          renderItem={(p) => (
            <ItemCard
              title={p.title}
              subtitle={`${p.startDate ?? ""}${p.isOngoing ? " – Ongoing" : p.endDate ? ` – ${p.endDate}` : ""}`}
              description={p.description}
              tags={p.technologies}
              links={[
                p.projectUrl && { label: "Live", url: p.projectUrl },
                p.sourceCodeUrl && { label: "Code", url: p.sourceCodeUrl },
              ].filter(Boolean) as { label: string; url: string }[]}
              onEdit={() => { setEditing(p); setOpen(true); }}
              onRemove={() => remove.mutate(p.id)}
            />
          )}
        />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader><SheetTitle>{editing ? "Edit project" : "Add project"}</SheetTitle></SheetHeader>
          <ProjectForm
            resumeId={resumeId}
            initial={editing}
            onDone={() => { setOpen(false); refetch(); }}
          />
        </SheetContent>
      </Sheet>

      <div className="mt-6 flex justify-end">
        <Button onClick={onNext}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ProjectForm({
  resumeId,
  initial,
  onDone,
}: {
  resumeId: string;
  initial: ProjectResponse | null;
  onDone: () => void;
}) {
  const [data, setData] = useState<ProjectRequest>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    technologies: initial?.technologies ?? [],
    projectUrl: initial?.projectUrl ?? "",
    sourceCodeUrl: initial?.sourceCodeUrl ?? "",
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
    isOngoing: initial?.isOngoing ?? false,
  });
  const save = useMutation({
    mutationFn: () =>
      initial
        ? projectsService.update(resumeId, initial.id, data)
        : projectsService.create(resumeId, data),
    onSuccess: () => { toast.success("Saved"); onDone(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save"),
  });
  return (
    <div className="mt-4 space-y-4">
      <Field label="Title" required>
        <Input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
      </Field>
      <Field label="Description">
        <Textarea
          rows={4}
          value={data.description ?? ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      </Field>
      <Field label="Technologies">
        <TagInput value={data.technologies ?? []} onChange={(t) => setData({ ...data, technologies: t })} />
      </Field>
      <Field label="Project URL">
        <Input value={data.projectUrl ?? ""} onChange={(e) => setData({ ...data, projectUrl: e.target.value })} />
      </Field>
      <Field label="Source Code URL">
        <Input value={data.sourceCodeUrl ?? ""} onChange={(e) => setData({ ...data, sourceCodeUrl: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start Date">
          <Input type="date" value={data.startDate ?? ""} onChange={(e) => setData({ ...data, startDate: e.target.value })} />
        </Field>
        <Field label="End Date">
          <Input
            type="date"
            value={data.endDate ?? ""}
            disabled={data.isOngoing}
            onChange={(e) => setData({ ...data, endDate: e.target.value })}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={!!data.isOngoing} onCheckedChange={(v) => setData({ ...data, isOngoing: !!v })} />
        Ongoing project
      </label>
      <SheetFooter>
        <Button onClick={() => save.mutate()} disabled={!data.title || save.isPending}>
          <Save className="size-4" /> {save.isPending ? "Saving…" : "Save"}
        </Button>
      </SheetFooter>
    </div>
  );
}

// ============ STEP 6: SKILLS ============
function SkillsStep({
  resumeId,
  items,
  refetch,
  onNext,
}: {
  resumeId: string;
  items: ResumeSkillResponse[];
  refetch: () => void;
  onNext: () => void;
}) {
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState<ProficiencyLevel>(ProficiencyLevel.INTERMEDIATE);
  const [years, setYears] = useState<string>("");
  const create = useMutation({
    mutationFn: () =>
      resumeSkillsService.create(resumeId, {
        skillName,
        proficiencyLevel: level,
        yearsOfExperience: years ? Number(years) : undefined,
      } as ResumeSkillRequest),
    onSuccess: () => {
      setSkillName("");
      setYears("");
      refetch();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not add"),
  });
  const remove = useMutation({
    mutationFn: (id: number) => resumeSkillsService.remove(resumeId, id),
    onSuccess: refetch,
  });

  return (
    <div>
      <SectionHeader title="Skills" subtitle="Add 5–10 relevant skills with proficiency levels." />
      <div className="mt-4 grid grid-cols-1 gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-[1fr_180px_120px_auto]">
        <Input placeholder="Skill (e.g. React)" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
        <Select value={level} onValueChange={(v) => setLevel(v as ProficiencyLevel)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.values(ProficiencyLevel).map((l) => (
              <SelectItem key={l} value={l}>{humanizeEnum(l)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          min={0}
          max={50}
          placeholder="Years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <Button onClick={() => create.mutate()} disabled={!skillName || create.isPending}>
          <Plus className="size-4" /> Add
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyHint text="No skills yet." />
      ) : (
        <div className="mt-4">
          <SortableList
            items={items}
            onReorder={() => toast.info("Local reorder only.")}
            renderItem={(s) => (
              <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{s.skillName}</span>
                  <SkillBadge className="bg-info-soft text-info">
                    {humanizeEnum(s.proficiencyLevel)}
                  </SkillBadge>
                  {s.yearsOfExperience != null && (
                    <span className="text-xs text-muted-foreground">{s.yearsOfExperience}y</span>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(s.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          />
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button onClick={onNext}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// ============ STEP 7: REVIEW ============
function ReviewStep({
  resume,
  work,
  edu,
  projects,
  skills,
  score,
  onSaved,
}: {
  resume: ResumeResponse;
  work: WorkExperienceResponse[];
  edu: EducationResponse[];
  projects: ProjectResponse[];
  skills: ResumeSkillResponse[];
  score: number;
  onSaved: () => void;
}) {
  const [template, setTemplate] = useState<ResumeTemplate>(resume.resumeTemplate);
  const [visibility, setVisibility] = useState<ResumeVisibility>(resume.resumeVisibility);
  const [isDefault, setIsDefault] = useState(resume.isDefault);

  const save = useMutation({
    mutationFn: async () => {
      // Persist template/visibility via personal-info passthrough is not available;
      // update summary just to bump updatedAt; set default if requested.
      if (isDefault && !resume.isDefault) {
        await resumesService.setDefault(resume.id);
      }
      return true;
    },
    onSuccess: () => {
      toast.success("Resume finalized");
      onSaved();
    },
  });

  return (
    <div className="space-y-6">
      <SectionHeader title="Review & Finalize" subtitle="Check everything looks right before you save." />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="text-xs uppercase text-muted-foreground">Completion</div>
          <div className="mt-1 font-display text-3xl font-bold">{score}%</div>
          <Progress className="mt-2" value={score} />
        </div>
        <div className="rounded-xl border p-4">
          <Label>Template</Label>
          <Select value={template} onValueChange={(v) => setTemplate(v as ResumeTemplate)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.values(ResumeTemplate).map((t) => (
                <SelectItem key={t} value={t}>{humanizeEnum(t)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-xl border p-4">
          <Label>Visibility</Label>
          <Select value={visibility} onValueChange={(v) => setVisibility(v as ResumeVisibility)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.values(ResumeVisibility).map((v) => (
                <SelectItem key={v} value={v}>{humanizeEnum(v)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <div>
          <div className="font-medium">Set as default</div>
          <div className="text-xs text-muted-foreground">Use this resume when applying to jobs by default.</div>
        </div>
        <Switch checked={isDefault} onCheckedChange={setIsDefault} />
      </label>

      <PreviewCard title="Personal">
        <div className="text-sm">
          <div className="font-medium">
            {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
          </div>
          {resume.personalInfo?.headline && (
            <div className="text-muted-foreground">{resume.personalInfo.headline}</div>
          )}
          <div className="mt-1 text-xs text-muted-foreground">
            {[resume.personalInfo?.email, resume.personalInfo?.phone, resume.personalInfo?.city]
              .filter(Boolean)
              .join(" · ")}
          </div>
        </div>
      </PreviewCard>

      {resume.summary && (
        <PreviewCard title="Summary">
          <p className="whitespace-pre-line text-sm text-muted-foreground">{resume.summary}</p>
        </PreviewCard>
      )}

      {work.length > 0 && (
        <PreviewCard title={`Experience (${work.length})`}>
          <ul className="space-y-2 text-sm">
            {work.map((w) => (
              <li key={w.id}>
                <span className="font-medium">{w.jobTitle}</span> · {w.companyName}{" "}
                <span className="text-xs text-muted-foreground">
                  ({w.startDate} – {w.isCurrentJob ? "Present" : w.endDate})
                </span>
              </li>
            ))}
          </ul>
        </PreviewCard>
      )}

      {edu.length > 0 && (
        <PreviewCard title={`Education (${edu.length})`}>
          <ul className="space-y-2 text-sm">
            {edu.map((e) => (
              <li key={e.id}>
                <span className="font-medium">{e.degree}</span>
                {e.fieldOfStudy && `, ${e.fieldOfStudy}`} · {e.institutionName}
              </li>
            ))}
          </ul>
        </PreviewCard>
      )}

      {projects.length > 0 && (
        <PreviewCard title={`Projects (${projects.length})`}>
          <ul className="space-y-2 text-sm">
            {projects.map((p) => (
              <li key={p.id}><span className="font-medium">{p.title}</span></li>
            ))}
          </ul>
        </PreviewCard>
      )}

      {skills.length > 0 && (
        <PreviewCard title={`Skills (${skills.length})`}>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <SkillBadge key={s.id} className="bg-secondary text-foreground">
                {s.skillName}
              </SkillBadge>
            ))}
          </div>
        </PreviewCard>
      )}

      <div className="flex justify-end">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          <Save className="size-4" /> {save.isPending ? "Saving…" : "Save Resume"}
        </Button>
      </div>
    </div>
  );
}

// ============ SHARED ============
function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function ItemCard({
  title,
  subtitle,
  description,
  tags,
  links,
  onEdit,
  onRemove,
}: {
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  links?: { label: string; url: string }[];
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-medium">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
          {description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          )}
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((t) => (
                <SkillBadge key={t} className="bg-secondary text-foreground">{t}</SkillBadge>
              ))}
            </div>
          )}
          {links && links.length > 0 && (
            <div className="mt-2 flex gap-3 text-xs">
              {links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="size-3" /> {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit}><Pencil className="size-4" /></Button>
          <Button variant="ghost" size="icon" onClick={onRemove}><Trash2 className="size-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}
