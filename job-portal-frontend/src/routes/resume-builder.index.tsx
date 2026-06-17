import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { blockEmployer } from "@/lib/auth/guards";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Plus, Pencil, Trash2, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/templates/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkillBadge } from "@/components/atoms/Badges";
import { resumesService } from "@/lib/services/resumes.service";
import { useAuth } from "@/lib/auth/context";
import { formatDate, humanizeEnum } from "@/lib/format";
import { ResumeTemplate, ResumeVisibility } from "@/types";

export const Route = createFileRoute("/resume-builder/")({
  beforeLoad: () => blockEmployer(),
  head: () => ({
    meta: [
      { title: "Resume Builder — HireMe" },
      { name: "description", content: "Build and manage tailored resumes for every application." },
    ],
  }),
  component: ResumeBuilderIndex,
});

function ResumeBuilderIndex() {
  const { isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState<ResumeTemplate>(ResumeTemplate.MODERN);
  const [visibility, setVisibility] = useState<ResumeVisibility>(ResumeVisibility.PRIVATE);

  useEffect(() => {
    if (isReady && !isAuthenticated) navigate({ to: "/auth/login" });
  }, [isAuthenticated, isReady, navigate]);

  const { data: resumes, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => resumesService.list(),
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: () => {
      if (!title.trim()) {
        throw new Error("Title is required");
      }
      const payload = {
        title: title.trim(),
        template: template as string,
        visibility: visibility as string,
      };
      console.log("Creating resume with payload:", payload);
      return resumesService.create(payload as any);
    },
    onSuccess: (r) => {
      toast.success("Resume created — let's build it");
      navigate({ to: "/resume-builder/$resumeId", params: { resumeId: String(r.id) } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create resume"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => resumesService.remove(id),
    onSuccess: () => toast.success("Resume deleted"),
  });

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Resume Builder</h1>
            <p className="mt-1 text-muted-foreground">
              Create tailored resumes with our step-by-step wizard.
            </p>
          </div>
          <Button onClick={() => setCreating((v) => !v)}>
            <Plus className="size-4" /> New Resume
          </Button>
        </div>

        {creating && (
          <div className="mt-6 rounded-xl border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Start a new resume</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="md:col-span-3">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior React Developer"
                  className="mt-1.5"
                />
              </div>
              <div>
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
              <div>
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
              <div className="flex items-end justify-end gap-2 md:col-span-3">
                <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
                <Button
                  disabled={!title || createMutation.isPending}
                  onClick={() => createMutation.mutate()}
                >
                  {createMutation.isPending ? "Creating…" : "Start Building"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {!isLoading && resumes?.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed bg-muted/30 p-10 text-center">
              <FileText className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                You don't have any resumes yet. Click "New Resume" to get started.
              </p>
            </div>
          )}
          {resumes?.map((r) => (
            <div key={r.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-start gap-4">
                <div className="grid size-12 place-items-center rounded-lg bg-info-soft text-primary">
                  <FileText className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <SkillBadge className="bg-info-soft text-info">{humanizeEnum(r.resumeTemplate)}</SkillBadge>
                    <SkillBadge className="bg-muted text-muted-foreground">{humanizeEnum(r.resumeVisibility)}</SkillBadge>
                    {r.isDefault && <SkillBadge className="bg-success-soft text-success">Default</SkillBadge>}
                    {typeof r.completionScore === "number" && (
                      <SkillBadge className="bg-warning/20 text-warning-foreground">
                        {r.completionScore}% complete
                      </SkillBadge>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Updated {formatDate(r.updatedAt)}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    navigate({ to: "/resume-builder/$resumeId", params: { resumeId: String(r.id) } })
                  }
                >
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(r.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
