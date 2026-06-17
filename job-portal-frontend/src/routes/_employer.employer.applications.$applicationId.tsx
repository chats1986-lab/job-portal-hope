import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Star, StarOff, Sparkles, Mail, FileText, DollarSign, Calendar, CheckCircle2,
} from "lucide-react";
import { applicationsService } from "@/lib/services/applications.service";
import { aiApplicationService } from "@/lib/services/ai-application.service";
import { ApplicationStatus } from "@/types";
import { ApplicationStatusBadge } from "@/components/employer/StatusBadge";
import { AIScoreRing } from "@/components/employer/AIScoreRing";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_employer/employer/applications/$applicationId")({
  head: () => ({ meta: [{ title: "Application — Employer" }] }),
  component: ApplicationDetail,
});

function ApplicationDetail() {
  const { applicationId } = Route.useParams();
  const qc = useQueryClient();
  const [aiLoading, setAiLoading] = useState<"score" | "gap" | null>(null);
  const [score, setScore] = useState<{ score: number; matchPercentage: number; strengths: string[]; weaknesses: string[]; recommendations: string[] } | null>(null);
  const [gap, setGap] = useState<{ matched: string[]; missing: string[] } | null>(null);

  const appQuery = useQuery({
    queryKey: ["employer", "application", applicationId],
    queryFn: () => applicationsService.getById(applicationId),
  });

  const statusMut = useMutation({
    mutationFn: (status: ApplicationStatus) => applicationsService.updateStatus(applicationId, { status }),
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["employer"] }); },
  });
  const starMut = useMutation({
    mutationFn: () => applicationsService.toggleStar(applicationId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["employer"] }); },
  });

  const runScore = async () => {
    setAiLoading("score");
    try {
      const res = await aiApplicationService.screeningScore(applicationId);
      setScore({
        score: res.score,
        matchPercentage: res.skillsMatchScore,
        strengths: res.matchedSkills ?? [],
        weaknesses: res.missingSkills ?? [],
        recommendations: res.concerns ?? [],
      });
      toast.success("AI screening complete");
    } catch (e) {
      // Fall back to a deterministic mock for demo purposes if endpoint not yet wired.
      const s = 40 + ((Number(applicationId) * 37) % 60);
      setScore({
        score: s,
        matchPercentage: s,
        strengths: ["Strong React experience", "Clear communication", "Relevant project work"],
        weaknesses: ["Limited backend exposure", "No mentions of testing"],
        recommendations: ["Probe system-design experience in interview"],
      });
      toast.message("Showing demo AI insights (live endpoint unavailable).");
    } finally {
      setAiLoading(null);
    }
  };

  const runGap = async () => {
    setAiLoading("gap");
    try {
      const res = await aiApplicationService.skillsGap(applicationId);
      setGap({ matched: res.matchedSkills ?? [], missing: res.missingSkills ?? [] });
    } catch {
      setGap({ matched: ["React", "TypeScript", "REST APIs"], missing: ["GraphQL", "Kubernetes"] });
      toast.message("Showing demo skills gap (live endpoint unavailable).");
    } finally {
      setAiLoading(null);
    }
  };

  const app = appQuery.data;
  if (appQuery.isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!app) return <div className="text-sm text-muted-foreground">Application not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/employer/applications" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to applications
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium uppercase text-muted-foreground">Candidate</div>
                <h1 className="mt-1 font-display text-2xl font-bold">{app.candidate?.fullName ?? "—"}</h1>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Mail className="size-3" />{app.candidate?.email}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="size-3" />Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                  {app.expectedSalary && <span className="inline-flex items-center gap-1"><DollarSign className="size-3" />${app.expectedSalary}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => starMut.mutate()}>
                  {app.isStarred ? <Star className="size-4 fill-amber-400 text-amber-500" /> : <StarOff className="size-4" />}
                </Button>
                <ApplicationStatusBadge status={app.status} />
              </div>
            </div>
            <div className="mt-4 rounded-xl border bg-muted/40 p-3 text-sm">
              <div className="font-medium">Applying to: {app.job?.title ?? "—"}</div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-3 font-display text-base font-bold">Cover letter</h2>
            <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {app.coverLetter || <span className="italic">No cover letter provided.</span>}
            </p>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold">AI insights</h2>
              <div className="flex gap-2">
                <Button onClick={runScore} disabled={aiLoading !== null} size="sm" variant="outline">
                  <Sparkles className="mr-1 size-4" /> {aiLoading === "score" ? "Scoring…" : "Run screening"}
                </Button>
                <Button onClick={runGap} disabled={aiLoading !== null} size="sm" variant="outline">
                  <Sparkles className="mr-1 size-4" /> {aiLoading === "gap" ? "Analyzing…" : "Skills gap"}
                </Button>
              </div>
            </div>
            {score && (
              <div className="mb-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
                <AIScoreRing score={score.score} size={88} label="Overall" />
                <div className="space-y-2 text-sm">
                  <div><span className="font-semibold text-emerald-700">Strengths:</span> {score.strengths.join(", ")}</div>
                  <div><span className="font-semibold text-rose-700">Gaps:</span> {score.weaknesses.join(", ")}</div>
                  {score.recommendations.length > 0 && (
                    <div><span className="font-semibold">Recommendations:</span> {score.recommendations.join(" ")}</div>
                  )}
                </div>
              </div>
            )}
            {gap && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase text-emerald-700">Matched</div>
                  <div className="flex flex-wrap gap-2">
                    {gap.matched.map((s) => <span key={s} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{s}</span>)}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase text-rose-700">Missing</div>
                  <div className="flex flex-wrap gap-2">
                    {gap.missing.map((s) => <span key={s} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">{s}</span>)}
                  </div>
                </div>
              </div>
            )}
            {!score && !gap && (
              <p className="text-sm text-muted-foreground">Run AI screening to score the candidate and surface skill gaps.</p>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 font-display text-base font-bold">Update status</h3>
            <Select value={app.status} onValueChange={(v) => statusMut.mutate(v as ApplicationStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(ApplicationStatus).map((v) => (
                  <SelectItem key={v} value={v}>{v.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 font-display text-base font-bold">Resume</h3>
            <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
              <FileText className="mb-2 size-5" />
              Resume ID #{app.resumeId}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 font-display text-base font-bold">Timeline</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 text-emerald-600" /><span>Applied <span className="text-muted-foreground">· {new Date(app.appliedAt).toLocaleString()}</span></span></li>
              {app.updatedAt && app.updatedAt !== app.appliedAt && (
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 text-sky-600" /><span>Status: {app.status} <span className="text-muted-foreground">· {new Date(app.updatedAt).toLocaleString()}</span></span></li>
              )}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
