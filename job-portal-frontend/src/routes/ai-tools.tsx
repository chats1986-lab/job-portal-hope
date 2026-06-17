import { createFileRoute } from "@tanstack/react-router";
import { blockEmployer } from "@/lib/auth/guards";
import { Sparkles, FileText, MessageSquare, Target } from "lucide-react";
import { AppLayout } from "@/components/templates/AppLayout";

export const Route = createFileRoute("/ai-tools")({
  beforeLoad: () => blockEmployer(),
  head: () => ({ meta: [{ title: "AI Tools — HireMe" }] }),
  component: () => (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-info-soft px-3 py-1 text-xs font-medium text-info">
          <Sparkles className="size-3.5" /> AI Toolkit
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold">AI Tools</h1>
        <p className="mt-2 text-muted-foreground">Boost your job search with our AI-powered assistants.</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: FileText, title: "Resume Builder", desc: "Generate a tailored resume in seconds." },
            { icon: MessageSquare, title: "Cover Letter Writer", desc: "Personalized cover letters per role." },
            { icon: Target, title: "Interview Prep", desc: "Practice with AI mock interviews." },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="rounded-xl border bg-card p-6">
                <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><Icon className="size-5" /></span>
                <h3 className="mt-4 font-display text-lg font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  ),
});
