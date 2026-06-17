import { createFileRoute, Link } from "@tanstack/react-router";
import { blockEmployer } from "@/lib/auth/guards";
import { useQuery } from "@tanstack/react-query";
import { Target, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/templates/AppLayout";
import { JobCard } from "@/components/organisms/JobCard";
import { Button } from "@/components/ui/button";
import { jobsService } from "@/lib/services/jobs.service";

export const Route = createFileRoute("/ai-match")({
  beforeLoad: () => blockEmployer(),
  head: () => ({ meta: [{ title: "Smart Match — HireMe" }] }),
  component: () => {
    const { data } = useQuery({ queryKey: ["jobs", "match"], queryFn: () => jobsService.list({ size: 6 }) });
    return (
      <AppLayout>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border bg-gradient-to-br from-info-soft/60 to-accent p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Target className="size-3.5" /> Smart Matching
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold">Jobs matched to your profile</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Roles ranked using your resume, skills, and preferences.
            </p>
            <Link to="/resume-builder"><Button className="mt-5"><Sparkles className="size-4" /> Update Profile</Button></Link>
          </div>
          <div className="mt-8 space-y-4">
            {data?.content?.slice(0, 3).map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        </div>
      </AppLayout>
    );
  },
});
