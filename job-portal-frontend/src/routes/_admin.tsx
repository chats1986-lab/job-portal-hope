import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, LogOut, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils";
import { decodeJwt, extractRole, isExpired } from "@/lib/auth/jwt";
import { UserRole, type UserResponse } from "@/types";

const TOKEN_KEY = "HireMe.token";
const USER_KEY = "HireMe.user";

export const Route = createFileRoute("/_admin")({
  beforeLoad: ({ location }) => {
    // SSR-safe: only enforce in the browser.
    if (typeof window === "undefined") return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw redirect({ to: "/auth/login", search: { redirect: location.href } as never });
    }
    const payload = decodeJwt(token);
    if (isExpired(payload)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      throw redirect({ to: "/auth/login" });
    }
    let role: string | null = extractRole(payload);
    if (!role) {
      try {
        const raw = localStorage.getItem(USER_KEY);
        const u = raw ? (JSON.parse(raw) as UserResponse) : null;
        role = u?.role ?? null;
      } catch {
        role = null;
      }
    }
    if (role !== UserRole.ROLE_ADMIN) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users, exact: false },
] as const;

function AdminLayout() {
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-card lg:flex">
        <div className="border-b p-4">
          <Logo />
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <ShieldCheck className="size-3.5" /> Admin Console
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <div className="px-3 py-2">
            <div className="truncate text-sm font-semibold">{user?.fullName ?? "Admin"}</div>
            <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
