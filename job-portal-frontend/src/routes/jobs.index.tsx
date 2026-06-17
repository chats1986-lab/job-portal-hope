import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Briefcase, Filter, Loader2, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { EmptyState } from "@/components/molecules/EmptyState";
import { JobCardSkeleton } from "@/components/molecules/Skeletons";
import { JobCard } from "@/components/organisms/JobCard";
import { AppLayout } from "@/components/templates/AppLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { humanizeEnum } from "@/lib/format";
import { jobsService } from "@/lib/services/jobs.service";
import { ExperienceLevel, JobType, WorkMode } from "@/types";

const search = z.object({
  q: z.string().optional(),
  loc: z.string().optional(),
  jobType: z.nativeEnum(JobType).optional(),
  workMode: z.nativeEnum(WorkMode).optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
});

export const Route = createFileRoute("/jobs/")({
  validateSearch: search,
  component: JobsPage,
});

const JOB_TYPES = Object.values(JobType);
const WORK_MODES = Object.values(WorkMode);
const EXPERIENCE_LEVELS = Object.values(ExperienceLevel);
const PAGE_SIZE = 10;

function JobsPage() {
  const params = Route.useSearch();
  const { q, loc, jobType, workMode, experienceLevel } = params;
  const navigate = useNavigate({ from: "/jobs" });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["jobs", "infinite", params],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      jobsService.list({
        query: q,
        location: loc,
        jobType,
        workMode,
        experienceLevel,
        page: pageParam as number,
        size: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, allPages) =>
      (lastPage?.content?.length ?? 0) < PAGE_SIZE ? undefined : allPages.length,
    retry: 1,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const setParam = <K extends keyof typeof params>(key: K, value: (typeof params)[K] | undefined) => {
    navigate({ search: (s: typeof params) => ({ ...s, [key]: value }) });
  };

  const jobs = data?.pages.flatMap(page => page.content) ?? [];
  const uniqueJobs = jobs.filter((job, index, self) =>
    index === self.findIndex((j) => j.id === job.id)
  );
  const activeFilterCount = [jobType, workMode, experienceLevel].filter(Boolean).length;

  const filterContent = (
    <>
      <FilterGroup title="Job Type">
        {JOB_TYPES.map((t) => (
          <FilterRow key={t} label={humanizeEnum(t)} checked={jobType === t}
            onChange={() => setParam("jobType", jobType === t ? undefined : t)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Work Mode">
        {WORK_MODES.map((m) => (
          <FilterRow key={m} label={humanizeEnum(m)} checked={workMode === m}
            onChange={() => setParam("workMode", workMode === m ? undefined : m)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Experience">
        {EXPERIENCE_LEVELS.map((e) => (
          <FilterRow key={e} label={humanizeEnum(e)} checked={experienceLevel === e}
            onChange={() => setParam("experienceLevel", experienceLevel === e ? undefined : e)} />
        ))}
      </FilterGroup>
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate({ search: { q, loc } })}
        >
          Clear all filters
        </Button>
      )}
    </>
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="size-4" /> {uniqueJobs.length} jobs loaded
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:inline-flex">
              <TrendingUp className="size-4" /> Newest first
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="size-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="inline-flex items-center gap-2">
                    <Filter className="size-4" /> Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4">{filterContent}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden rounded-xl border bg-card p-5 lg:block">
            <div className="mb-4 inline-flex items-center gap-2 font-semibold">
              <Filter className="size-4" /> Filters
            </div>
            {filterContent}
          </aside>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)
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
                {!hasNextPage && uniqueJobs.length > PAGE_SIZE && (
                  <p className="py-6 text-center text-xs text-muted-foreground">You've reached the end</p>
                )}
              </>
            ) : (
              <EmptyState title="No jobs match your filters" description="Try clearing filters or a broader keyword." />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function FilterRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span>{label}</span>
    </label>
  );
}