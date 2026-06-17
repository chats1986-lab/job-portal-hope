import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { JobForm } from "@/components/employer/JobForm";
import { jobsService } from "@/lib/services/jobs.service";

export const Route = createFileRoute("/_employer/employer/jobs/$jobId/edit")({
  head: () => ({ meta: [{ title: "Edit Job — Employer" }] }),
  component: EditJob,
});

function EditJob() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const jobQuery = useQuery({
    queryKey: ["employer", "job", jobId],
    queryFn: () => jobsService.getById(jobId),
  });

  const updateMut = useMutation({
    mutationFn: (data: Parameters<typeof jobsService.update>[1]) => jobsService.update(jobId, data),
    onSuccess: () => {
      toast.success("Job updated");
      qc.invalidateQueries({ queryKey: ["employer"] });
      navigate({ to: "/employer/jobs/$jobId", params: { jobId } });
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to update job"),
  });

  const job = jobQuery.data;
  if (jobQuery.isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!job) return <div className="text-sm text-muted-foreground">Job not found.</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Edit job</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update job details.</p>
      </div>
      <JobForm
        defaultValues={{
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          responsibilities: job.responsibilities,
          benefits: job.benefits,
          categoryId: job.jobCategory?.id ?? 1,
          address: job.address, city: job.city, state: job.state, country: job.country, zipCode: job.zipCode,
          minSalary: job.minSalary, maxSalary: job.maxSalary,
          jobType: job.jobType, workMode: job.workMode, experienceLevel: job.experienceLevel,
          openings: job.openings,
          applicationDeadline: job.applicationDeadline?.slice(0, 10),
          expiresAt: job.expiresAt?.slice(0, 10),
          skillsText: job.jobSkills?.map((s) => s.skillName) ?? [],
          tagsText: job.jobTags?.map((t) => t.name) ?? [],
        }}
        submitting={updateMut.isPending}
        submitLabel="Save changes"
        onCancel={() => navigate({ to: "/employer/jobs/$jobId", params: { jobId } })}
        onSubmit={(data) => updateMut.mutate(data)}
      />
    </div>
  );
}
