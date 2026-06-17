import { Briefcase } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Briefcase className="size-5" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">HireMe</span>
    </Link>
  );
}
