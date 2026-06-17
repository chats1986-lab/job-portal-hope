import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HeaderSearchBar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const submit = (e: React.SubmitEvent) => {
    e.preventDefault();
    navigate({ to: "/jobs", search: { q: q || undefined, loc: loc || undefined } });
  };
  return (
    <form
      onSubmit={submit}
      className="flex w-full flex-col gap-2 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Job title or keyword"
          className="h-11 w-full rounded-xl border-border bg-card pl-9"
        />
      </div>
      <div className="relative sm:w-56">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="Location"
          className="h-11 w-full rounded-xl border-border bg-card pl-9"
        />
      </div>
      <Button disabled={!q || !loc} type="submit" className="h-11 rounded-xl px-6">
        Search
      </Button>
    </form>
  );
}
