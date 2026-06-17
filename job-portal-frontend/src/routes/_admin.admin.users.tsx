import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Users</h1>
        <p className="mt-1 text-muted-foreground">Manage candidates, employers, and admins.</p>
      </div>
      <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          User management UI will appear here once the backend admin endpoints are available.
        </p>
      </div>
    </div>
  );
}
