import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Building2, Users, FileText } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — HireMe" }] }),
  component: AdminDashboard,
});

const stats = [
  { label: "Total Users", value: "—", icon: Users },
  { label: "Companies", value: "—", icon: Building2 },
  { label: "Active Jobs", value: "—", icon: Briefcase },
  { label: "Applications", value: "—", icon: FileText },
];

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Platform-wide overview and controls.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <div className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
            </div>
          );
        })}
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Welcome, Admin</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the sidebar to manage users and review platform activity. Admin endpoints will be wired in as backend support lands.
        </p>
      </div>
    </div>
  );
}
