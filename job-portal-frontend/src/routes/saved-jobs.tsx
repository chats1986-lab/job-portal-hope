import { blockEmployer } from '@/lib/auth/guards';
import { JobCard } from '@/components/organisms/JobCard'
import { AppLayout } from '@/components/templates/AppLayout'
import { jobsService } from '@/lib/services/jobs.service'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/saved-jobs')({
  beforeLoad: () => blockEmployer(),
  head: () => ({ meta: [{ title: "Saved Jobs — HireMe" }] }),
  component: SavedJobsPage,
})

function SavedJobsPage() {
    const {data: jobs, isLoading} = useQuery({
        queryKey: ["saved-jobs"],
        queryFn: () => jobsService.getSavedJobs()
    })

    if (isLoading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-5xl px-4 py-10">Loading...</div>
      </AppLayout>
    );
  }

  return <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">Saved Jobs</h1>
        {jobs?.length === 0 ? (
          <p className="text-muted-foreground">No saved jobs yet</p>
        ) : (
          <div className="space-y-4">
            {jobs?.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </AppLayout>
}
