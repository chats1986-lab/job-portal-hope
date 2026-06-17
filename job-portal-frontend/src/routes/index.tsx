import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Briefcase, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/templates/AppLayout";
import { JobCard } from "@/components/organisms/JobCard";
import { JobCardSkeleton } from "@/components/molecules/Skeletons";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Button } from "@/components/ui/button";
import { jobsService } from "@/lib/services/jobs.service";
import { useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireMe — Find Your Next Opportunity" },
      { name: "description", content: "Search thousands of open roles across companies hiring now." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [aiQuery, setAiQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["jobs", "home", "infinite"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      jobsService.list({
        page: pageParam as number,
        size: 8,
      }),
    getNextPageParam: (lastPage, allPages) =>
      (lastPage?.content?.length ?? 0) < 8 ? undefined : allPages.length,
    retry: 1,
  });

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    }, { rootMargin: "200px" });
    io.observe(el);

    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const jobs = data?.pages.flatMap(page => page.content) ?? [];
  const uniqueJobs = jobs.filter((job, index, self) =>
    index === self.findIndex((j) => j.id === job.id)
  );

  const onAiSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigate({ to: "/jobs", search: { q: aiQuery || undefined } });
  };

  return (
    <AppLayout>
      <section
        className="relative overflow-hidden text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="size-3.5" /> Smart Job Search
          </span>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-6xl">
            Find Your Next Opportunity
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/80">
            Discover thousands of jobs matched to your skills and experience
          </p>

          <form onSubmit={onAiSearch} className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/15 bg-white/95 p-4 text-left shadow-2xl backdrop-blur">
            <label htmlFor="ai-search" className="sr-only">Describe your ideal job</label>
            <div className="flex items-start gap-3 px-2 pt-2">
              <Sparkles className="mt-1 size-5 text-primary" />
              <textarea
                id="ai-search"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g. Remote senior React role with $120k+ salary"
                rows={2}
                className="flex-1 resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") onAiSearch(e);
                }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
              <span>Tip: Enter atleast 10 characters...</span>
              <Button disabled={aiQuery.trim().length <= 10} type="submit" className="rounded-xl">
                <Sparkles className="size-4" /> Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="size-4" /> {uniqueJobs?.length ?? 0} jobs found
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="size-4" /> Newest first
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <JobCardSkeleton key={i} />)
          ) : error ? (
            <EmptyState
              title="Couldn't load jobs"
              description={error instanceof Error ? error.message : "Make sure the backend is reachable."}
            />
          ) : uniqueJobs.length > 0 ? (
            <>
              {uniqueJobs.map((j) => <JobCard key={j.id} job={j} />)}
              <div ref={sentinelRef} className="h-1" />
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 size-4 animate-spin" /> Loading more jobs…
                </div>
              )}
              {!hasNextPage && uniqueJobs.length > 8 && (
                <p className="py-6 text-center text-xs text-muted-foreground">You've reached the end</p>
              )}
            </>
          ) : (
            <EmptyState title="No jobs available" description="Check back soon for new openings." />
          )}
        </div>
      </section>
    </AppLayout>
  );
}
