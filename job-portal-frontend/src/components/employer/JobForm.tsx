import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobType, WorkMode, ExperienceLevel, type JobRequest } from "@/types";
import { TagInput } from "@/components/resume-builder/TagInput";
import { aiJobService, extractDescription, extractList } from "@/lib/services/ai-job.service";

const schema = z.object({
  title: z.string().min(2, "Required"),
  description: z.string().min(10, "Add a longer description"),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
  categoryId: z.coerce.number().int().nonnegative(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  minSalary: z.union([z.string(), z.number()]).optional(),
  maxSalary: z.union([z.string(), z.number()]).optional(),
  jobType: z.nativeEnum(JobType),
  workMode: z.nativeEnum(WorkMode),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  openings: z.union([z.string(), z.number()]).optional(),
  applicationDeadline: z.string().optional(),
  expiresAt: z.string().optional(),
});

const toNum = (v: string | number | undefined): number | undefined => {
  if (v === undefined || v === "" || v === null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<JobRequest> & { tagsText?: string[]; skillsText?: string[] };
  submitting?: boolean;
  onSubmit: (data: JobRequest, tagNames: string[], skillNames: string[]) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

function AiButton({ loading, onClick, label = "Generate with AI" }: { loading: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-50"
    >
      {loading ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
      {loading ? "Generating…" : label}
    </button>
  );
}

export function JobForm({ defaultValues, submitting, onSubmit, onCancel, submitLabel = "Save" }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      requirements: defaultValues?.requirements ?? "",
      responsibilities: defaultValues?.responsibilities ?? "",
      benefits: defaultValues?.benefits ?? "",
      categoryId: defaultValues?.categoryId ?? 1,
      address: defaultValues?.address ?? "",
      city: defaultValues?.city ?? "",
      state: defaultValues?.state ?? "",
      country: defaultValues?.country ?? "",
      zipCode: defaultValues?.zipCode ?? "",
      minSalary: defaultValues?.minSalary,
      maxSalary: defaultValues?.maxSalary,
      jobType: defaultValues?.jobType ?? JobType.FULL_TIME,
      workMode: defaultValues?.workMode ?? WorkMode.REMOTE,
      experienceLevel: defaultValues?.experienceLevel ?? ExperienceLevel.MID_LEVEL,
      openings: defaultValues?.openings ?? 1,
      applicationDeadline: defaultValues?.applicationDeadline ?? "",
      expiresAt: defaultValues?.expiresAt ?? "",
    },
  });

  const [skills, setSkills] = useState<string[]>(defaultValues?.skillsText ?? []);
  const [tags, setTags] = useState<string[]>(defaultValues?.tagsText ?? []);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const requireTitle = (): string | null => {
    const t = form.getValues("title")?.trim();
    if (!t) {
      toast.error("Add a job title first");
      return null;
    }
    return t;
  };

  const runAi = async (key: string, fn: () => Promise<void>) => {
    setAiLoading(key);
    try {
      await fn();
    } catch (e) {
      toast.error((e as Error).message || "AI request failed");
    } finally {
      setAiLoading(null);
    }
  };

  const aiDescribe = () => {
    const title = requireTitle();
    if (!title) return;
    runAi("description", async () => {
      const res = await aiJobService.describe({
        title,
        skills,
        experienceLevel: form.getValues("experienceLevel"),
        jobType: form.getValues("jobType"),
        workMode: form.getValues("workMode"),
      });
      form.setValue("description", extractDescription(res), { shouldDirty: true, shouldValidate: true });
      toast.success("Description generated");
    });
  };

  const aiRequirements = () => {
    const title = requireTitle();
    if (!title) return;
    runAi("requirements", async () => {
      const out = await aiJobService.requirements({ title, description: form.getValues("description") });
      form.setValue("requirements", out, { shouldDirty: true });
      toast.success("Requirements generated");
    });
  };

  const aiResponsibilities = () => {
    const title = requireTitle();
    if (!title) return;
    runAi("responsibilities", async () => {
      const out = await aiJobService.responsibilities({ title, category: String(form.getValues("categoryId") ?? "") });
      form.setValue("responsibilities", out, { shouldDirty: true });
      toast.success("Responsibilities generated");
    });
  };

  const aiBenefits = () => {
    const title = requireTitle();
    if (!title) return;
    runAi("benefits", async () => {
      const out = await aiJobService.benefits({
        title,
        category: String(form.getValues("categoryId") ?? ""),
        jobType: form.getValues("jobType"),
      });
      form.setValue("benefits", out, { shouldDirty: true });
      toast.success("Benefits generated");
    });
  };

  const aiSalary = () => {
    const title = requireTitle();
    if (!title) return;
    runAi("salary", async () => {
      const res = await aiJobService.salarySuggestion({
        title,
        skills,
        experienceLevel: form.getValues("experienceLevel"),
        location: [form.getValues("city"), form.getValues("country")].filter(Boolean).join(", "),
        jobType: form.getValues("jobType"),
      });
      if (res.minSalary) form.setValue("minSalary", res.minSalary, { shouldDirty: true });
      if (res.maxSalary) form.setValue("maxSalary", res.maxSalary, { shouldDirty: true });
      toast.success(`Suggested ${res.minSalary} – ${res.maxSalary}${res.currency ? ` ${res.currency}` : ""}`);
    });
  };

  const aiSkills = () => {
    const title = requireTitle();
    if (!title) return;
    runAi("skills", async () => {
      const res = await aiJobService.skillsRecommendation({ title, description: form.getValues("description") });
      const list = extractList(res);
      const merged = Array.from(new Set([...skills, ...list]));
      setSkills(merged);
      toast.success(`Added ${list.length} skill${list.length === 1 ? "" : "s"}`);
    });
  };

  const aiTags = () => {
    const title = requireTitle();
    if (!title) return;
    runAi("tags", async () => {
      const res = await aiJobService.tagRecommendation({ title, description: form.getValues("description") });
      const list = extractList(res);
      const merged = Array.from(new Set([...tags, ...list]));
      setTags(merged);
      toast.success(`Added ${list.length} tag${list.length === 1 ? "" : "s"}`);
    });
  };

  const submit = form.handleSubmit((values) => {
    const payload: JobRequest = {
      title: values.title,
      description: values.description,
      requirements: values.requirements || undefined,
      responsibilities: values.responsibilities || undefined,
      benefits: values.benefits || undefined,
      categoryId: values.categoryId,
      address: values.address || undefined,
      city: values.city || undefined,
      state: values.state || undefined,
      country: values.country || undefined,
      zipCode: values.zipCode || undefined,
      minSalary: toNum(values.minSalary),
      maxSalary: toNum(values.maxSalary),
      jobType: values.jobType,
      workMode: values.workMode,
      experienceLevel: values.experienceLevel,
      openings: toNum(values.openings),
      applicationDeadline: values.applicationDeadline || undefined,
      expiresAt: values.expiresAt || undefined,
    };
    onSubmit(payload, tags, skills);
  });

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
      <h3 className="font-display text-base font-bold">{title}</h3>
      {children}
    </section>
  );

  const FieldHeader = ({ label, required, action }: { label: string; required?: boolean; action?: React.ReactNode }) => (
    <div className="flex items-center justify-between">
      <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
      {action}
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title="Basic info">
        <div className="space-y-2">
          <Label>Job title *</Label>
          <Input placeholder="Senior React Engineer" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <FieldHeader
            label="Description"
            required
            action={<AiButton loading={aiLoading === "description"} onClick={aiDescribe} />}
          />
          <Textarea rows={5} placeholder="Describe the role, culture, and what makes this position exciting…" {...form.register("description")} />
          {form.formState.errors.description && (
            <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldHeader
              label="Requirements"
              action={<AiButton loading={aiLoading === "requirements"} onClick={aiRequirements} label="Auto-fill from Title" />}
            />
            <Textarea rows={4} placeholder="List qualifications, education, certifications…" {...form.register("requirements")} />
          </div>
          <div className="space-y-2">
            <FieldHeader
              label="Responsibilities"
              action={<AiButton loading={aiLoading === "responsibilities"} onClick={aiResponsibilities} label="Auto-fill from Title" />}
            />
            <Textarea rows={4} placeholder="Key duties and day-to-day tasks…" {...form.register("responsibilities")} />
          </div>
        </div>
        <div className="space-y-2">
          <FieldHeader
            label="Benefits"
            action={<AiButton loading={aiLoading === "benefits"} onClick={aiBenefits} label="Auto-fill from Title" />}
          />
          <Textarea rows={3} placeholder="Health insurance, equity, remote work, gym membership…" {...form.register("benefits")} />
        </div>
      </Section>

      <Section title="Classification">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Job type</Label>
            <Select
              value={form.watch("jobType")}
              onValueChange={(v) => form.setValue("jobType", v as JobType)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(JobType).map((v) => (
                  <SelectItem key={v} value={v}>{v.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Work mode</Label>
            <Select
              value={form.watch("workMode")}
              onValueChange={(v) => form.setValue("workMode", v as WorkMode)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(WorkMode).map((v) => (
                  <SelectItem key={v} value={v}>{v.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Experience level</Label>
            <Select
              value={form.watch("experienceLevel")}
              onValueChange={(v) => form.setValue("experienceLevel", v as ExperienceLevel)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(ExperienceLevel).map((v) => (
                  <SelectItem key={v} value={v}>{v.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Location">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Address</Label><Input {...form.register("address")} /></div>
          <div className="space-y-2"><Label>City</Label><Input {...form.register("city")} /></div>
          <div className="space-y-2"><Label>State</Label><Input {...form.register("state")} /></div>
          <div className="space-y-2"><Label>Country</Label><Input {...form.register("country")} /></div>
          <div className="space-y-2"><Label>Zip code</Label><Input {...form.register("zipCode")} /></div>
        </div>
      </Section>

      <Section title="Salary & posting">
        <div className="flex justify-end">
          <AiButton loading={aiLoading === "salary"} onClick={aiSalary} label="Suggest salary range" />
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-2"><Label>Min salary</Label><Input type="number" {...form.register("minSalary")} /></div>
          <div className="space-y-2"><Label>Max salary</Label><Input type="number" {...form.register("maxSalary")} /></div>
          <div className="space-y-2"><Label>Openings</Label><Input type="number" {...form.register("openings")} /></div>
          <div className="space-y-2"><Label>Category ID</Label><Input type="number" {...form.register("categoryId")} /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Application deadline</Label><Input type="date" {...form.register("applicationDeadline")} /></div>
          <div className="space-y-2"><Label>Expires at</Label><Input type="date" {...form.register("expiresAt")} /></div>
        </div>
      </Section>

      <Section title="Skills & tags">
        <div className="space-y-2">
          <FieldHeader
            label="Skills"
            action={<AiButton loading={aiLoading === "skills"} onClick={aiSkills} label="Recommend skills" />}
          />
          <TagInput value={skills} onChange={setSkills} placeholder="Add a skill and press Enter" />
        </div>
        <div className="space-y-2">
          <FieldHeader
            label="Tags"
            action={<AiButton loading={aiLoading === "tags"} onClick={aiTags} label="Recommend tags" />}
          />
          <TagInput value={tags} onChange={setTags} placeholder="Add a tag and press Enter" />
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : submitLabel}</Button>
      </div>
    </form>
  );
}
