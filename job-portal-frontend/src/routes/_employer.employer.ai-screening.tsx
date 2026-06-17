import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Sparkles,
  Eye,
  Target,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/_employer/employer/ai-screening")({
  head: () => ({ meta: [{ title: "AI Screening — Employer" }] }),
  component: AIScreeningDashboard,
});

// Mock data shaped after the reference screenshot.
const stats = [
  { label: "Applications Today", value: 0, sub: "received today", icon: Users, tint: "bg-slate-100 text-slate-600" },
  { label: "Screened Today", value: 0, sub: "of 0 today", icon: Sparkles, tint: "bg-emerald-50 text-emerald-600" },
  { label: "Auto-Shortlisted", value: 0, sub: "score ≥ 90", icon: Sparkles, tint: "bg-violet-50 text-violet-600" },
  { label: "Needs Review", value: 2, sub: "flagged by AI", icon: Target, tint: "bg-amber-50 text-amber-600" },
];

const breakdown = [
  { label: "Auto Shortlisted", value: 0, pct: 0, color: "bg-emerald-500", ring: "stroke-emerald-500" },
  { label: "Review Recommended", value: 2, pct: 40, color: "bg-sky-500", ring: "stroke-sky-500" },
  { label: "Pending Review", value: 2, pct: 40, color: "bg-amber-400", ring: "stroke-amber-400" },
  { label: "Low Match", value: 1, pct: 20, color: "bg-rose-500", ring: "stroke-rose-500" },
  { label: "Not Screened", value: 0, pct: 0, color: "bg-slate-300", ring: "stroke-slate-300" },
];

const needsReview = [
  { id: 1, initials: "AG", name: "Aditya Gohil", role: "Junior Web Developer", score: 85, ring: "text-emerald-500" },
  { id: 2, initials: "PP", name: "Pablo Panday", role: "React Native Developer", score: 75, ring: "text-emerald-500" },
];

function AIScreeningDashboard() {
  const total = breakdown.reduce((a, b) => a + b.value, 0);
  const screenedCovered = 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-6 text-primary" />
            <h1 className="font-display text-3xl font-bold tracking-tight">AI Screening Dashboard</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time insights from automated candidate screening
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-emerald-600">
          <span className="relative grid size-2 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/50" />
            <span className="relative size-2 rounded-full bg-emerald-500" />
          </span>
          AI Active
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <div className={`grid size-9 place-items-center rounded-lg ${s.tint}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Breakdown + Coverage */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Screening Breakdown</h2>
              <p className="text-sm text-muted-foreground">Distribution across all {total} applications</p>
            </div>
          </div>
          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[200px_1fr]">
            <DonutChart segments={breakdown} total={total} />
            <ul className="space-y-3">
              {breakdown.map((b) => (
                <li key={b.label} className="flex items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${b.color}`} />
                    <span className="text-foreground">{b.label}</span>
                  </div>
                  <div className="flex items-center gap-6 tabular-nums text-muted-foreground">
                    <span className="font-medium text-foreground">{b.value}</span>
                    <span className="w-10 text-right">{b.pct}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Screening Coverage</h2>
          <p className="text-sm text-muted-foreground">Percentage of applications AI-screened</p>
          <div className="mt-6 flex justify-center">
            <RingProgress value={screenedCovered} label="screened" />
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <Row dotClass="bg-emerald-500" label="Screened" value={total} />
            <Row dotClass="bg-slate-300" label="Pending" value={0} />
            <div className="mt-2 flex items-center justify-between border-t pt-3 text-sm font-semibold">
              <span>Total</span>
              <span>{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Shortlisted + Needs Review */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-violet-500" />
                <h2 className="font-display text-lg font-semibold">Auto-Shortlisted</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Top candidates matching 90%+ of job requirements</p>
            </div>
            <span className="rounded-full border bg-muted px-2.5 py-1 text-xs font-medium">0 total</span>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center py-8 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-violet-50 text-violet-500">
              <Sparkles className="size-5" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">No auto-shortlisted candidates yet</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="size-5 text-sky-500" />
                <h2 className="font-display text-lg font-semibold">Needs Your Review</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Strong candidates flagged for a closer look</p>
            </div>
            <span className="rounded-full border bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
              {needsReview.length} total
            </span>
          </div>
          <ul className="mt-4 divide-y">
            {needsReview.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-muted text-sm font-bold text-foreground">
                    {c.initials}
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ScoreBadge value={c.score} />
                  <Link
                    to="/employer/ai-screening"
                    className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="View candidate"
                  >
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Row({ dotClass, label, value }: { dotClass: string; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className={`size-2.5 rounded-full ${dotClass}`} />
        <span>{label}</span>
      </div>
      <span className="font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function ScoreBadge({ value }: { value: number }) {
  const radius = 16;
  const c = 2 * Math.PI * radius;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative grid size-10 place-items-center">
      <svg viewBox="0 0 40 40" className="size-10 -rotate-90">
        <circle cx="20" cy="20" r={radius} className="fill-none stroke-muted" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          className="fill-none stroke-emerald-500"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-emerald-600">{value}%</span>
    </div>
  );
}

function RingProgress({ value, label }: { value: number; label: string }) {
  const radius = 60;
  const c = 2 * Math.PI * radius;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative grid size-44 place-items-center">
      <svg viewBox="0 0 140 140" className="size-44 -rotate-90">
        <circle cx="70" cy="70" r={radius} className="fill-none stroke-muted" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          className="fill-none stroke-emerald-500"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-2xl font-bold text-emerald-600">{value}%</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function DonutChart({
  segments,
  total,
}: {
  segments: { label: string; value: number; pct: number; color: string; ring: string }[];
  total: number;
}) {
  const radius = 60;
  const c = 2 * Math.PI * radius;
  let acc = 0;
  // Avoid divide-by-zero — when total is 0, render an empty ring.
  const safeTotal = total || 1;
  return (
    <div className="relative mx-auto grid size-44 place-items-center">
      <svg viewBox="0 0 140 140" className="size-44 -rotate-90">
        <circle cx="70" cy="70" r={radius} className="fill-none stroke-muted" strokeWidth="18" />
        {segments
          .filter((s) => s.value > 0)
          .map((s) => {
            const len = (s.value / safeTotal) * c;
            const dash = `${len} ${c - len}`;
            const offset = -acc;
            acc += len;
            return (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={radius}
                className={`fill-none ${s.ring}`}
                strokeWidth="18"
                strokeDasharray={dash}
                strokeDashoffset={offset}
              />
            );
          })}
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-2xl font-bold">{total}</div>
        <div className="text-xs text-muted-foreground">total</div>
      </div>
    </div>
  );
}
