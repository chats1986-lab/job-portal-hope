import { DollarSign } from "lucide-react";
import { formatSalary } from "@/lib/format";

export function SalaryBadge({
  min,
  max,
  currency,
}: {
  min?: number | null;
  max?: number | null;
  currency?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-foreground">
      <DollarSign className="size-4 text-muted-foreground" />
      {formatSalary(min, max, currency)}
    </span>
  );
}
