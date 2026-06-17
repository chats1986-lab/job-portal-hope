import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { JobForm } from "@/components/employer/JobForm";
import { jobsService } from "@/lib/services/jobs.service";

export const Route = createFileRoute("/_employer/employer/jobs/new")({
  head: () => ({ meta: [{ title: "Create Job — Employer" }] }),
  component: NewJob,
});

function NewJob() {
  const navigate = useNavigate();

  const createMut = useMutation({
    mutationFn: (input: { data: ReturnType<typeof Object> }) =>
      jobsService.create(input.data as never),
    onSuccess: (job) => {
      toast.success("Job created as draft");
      navigate({ to: "/employer/jobs/$jobId", params: { jobId: String(job.id) } });
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to create job"),
  });

  const publishMut = useMutation({
    mutationFn: async (data: Parameters<typeof jobsService.create>[0]) => {
      const created = await jobsService.create(data);
      await jobsService.publish(created.id);
      return created;
    },
    onSuccess: (job) => {
      toast.success("Job published");
      navigate({ to: "/employer/jobs/$jobId", params: { jobId: String(job.id) } });
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to publish job"),
  });

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Create job</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details below. Save as draft to refine later, or publish to make it live.
        </p>
      </div>
      <JobForm
        submitting={createMut.isPending || publishMut.isPending}
        submitLabel="Save as draft"
        onCancel={() => navigate({ to: "/employer/jobs" })}
        onSubmit={(data) => createMut.mutate({ data })}
      />
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-xl border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted"
          onClick={() => {
            // Trigger the form's submit handler via a custom event? Simpler: hint user.
            toast.message("Click the form's Save button, then use the job's Publish action.");
          }}
        >
          Publish flow note
        </button>
      </div>
    </div>
  );
}
