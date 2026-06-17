import { createFileRoute } from "@tanstack/react-router";
import { Bell, Lock, User } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

export const Route = createFileRoute("/_employer/employer/settings")({
  head: () => ({ meta: [{ title: "Settings — Employer" }] }),
  component: EmployerSettings,
});

function EmployerSettings() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account and notification preferences.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card icon={User} title="Account">
          <Row label="Name" value={user?.fullName ?? "—"} />
          <Row label="Email" value={user?.email ?? "—"} />
          <Row label="Role" value="Employer" />
        </Card>
        <Card icon={Bell} title="Notifications">
          <Row label="New applications" value="Enabled" />
          <Row label="Daily digest" value="Disabled" />
        </Card>
        <Card icon={Lock} title="Security">
          <Row label="Password" value="••••••••" />
          <Row label="2FA" value="Not enabled" />
        </Card>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, children }: { icon: typeof User; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <h3 className="font-display text-base font-bold">{title}</h3>
      </div>
      <div className="space-y-2 text-sm">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
