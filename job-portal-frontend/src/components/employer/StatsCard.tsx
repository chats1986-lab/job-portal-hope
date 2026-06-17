import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number | string;
  sub?: string;
  icon: LucideIcon;
  tint?: string;
  trend?: { value: number; positive?: boolean };
}

export function StatsCard({ label, value, sub, icon: Icon, tint, trend }: Props) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</div>
          {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
          {trend && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                trend.positive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700",
              )}
            >
              {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className={cn("grid size-10 place-items-center rounded-xl", tint ?? "bg-primary/10 text-primary")}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
