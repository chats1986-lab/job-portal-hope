import { cn } from "@/lib/utils";

interface Props {
  score: number; // 0-100
  size?: number;
  label?: string;
}

function colorFor(score: number) {
  if (score >= 80) return { ring: "stroke-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 60) return { ring: "stroke-sky-500", text: "text-sky-600", bg: "bg-sky-50" };
  if (score >= 40) return { ring: "stroke-amber-500", text: "text-amber-600", bg: "bg-amber-50" };
  return { ring: "stroke-rose-500", text: "text-rose-600", bg: "bg-rose-50" };
}

export function AIScoreRing({ score, size = 64, label }: Props) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (s / 100) * c;
  const colors = colorFor(s);
  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={5} className="fill-none stroke-muted" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className={cn("fill-none transition-all", colors.ring)}
          />
        </svg>
        <div className={cn("absolute inset-0 grid place-items-center text-sm font-bold tabular-nums", colors.text)}>
          {s}
        </div>
      </div>
      {label && <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>}
    </div>
  );
}

export function AIScoreBadge({ score }: { score: number }) {
  const colors = colorFor(score);
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", colors.bg, colors.text)}>
      {Math.round(score)}
    </span>
  );
}
