import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  label: string;
  description?: string;
}

export function Stepper({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <div className="flex w-full items-start">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.label} className="flex flex-1 items-start">
            <div className="flex min-w-0 flex-col items-center gap-1.5 sm:gap-2">
              <div
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors sm:size-10 sm:text-sm",
                  done && "bg-success text-success-foreground",
                  active && "bg-primary text-primary-foreground",
                  !done && !active && "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4 sm:size-5" /> : i + 1}
              </div>
              <div className="min-w-0 px-1 text-center">
                <div
                  className={cn(
                    "truncate text-xs font-semibold sm:text-sm",
                    active || done ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-1 mt-4 h-0.5 flex-1 rounded-full bg-border sm:mx-2 sm:mt-5">
                <div
                  className={cn("h-full rounded-full transition-all", done ? "bg-success w-full" : "w-0")}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
