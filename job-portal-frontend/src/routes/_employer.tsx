import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  Users,
  Sparkles,
  MessageSquare,
  Building2,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Bell,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils";
import { decodeJwt, extractRole, isExpired } from "@/lib/auth/jwt";
import { UserRole, type UserResponse } from "@/types";
import { Input } from "@/components/ui/input";

const TOKEN_KEY = "HireMe.token";
const USER_KEY = "HireMe.user";

export const Route = createFileRoute("/_employer")({
  beforeLoad: ({ location }) => {
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
    if (role !== UserRole.ROLE_EMPLOYER) {
      throw redirect({ to: "/" });
    }
  },
  component: EmployerLayout,
});

const sections = [
  {
    label: "Overview",
    items: [{ to: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Hiring",
    items: [
      { to: "/employer/jobs", label: "All Jobs", icon: Briefcase },
      { to: "/employer/jobs/new", label: "Create Job", icon: PlusCircle },
      { to: "/employer/applications", label: "Applications", icon: FileText },
      // { to: "/employer/candidates", label: "Candidates", icon: Users },
    ],
  },
  // {
  //   label: "Tools",
  //   items: [
  //     { to: "/employer/ai-screening", label: "AI Screening", icon: Sparkles },
  //     { to: "/employer/messages", label: "Messages", icon: MessageSquare },
  //   ],
  // },
  {
    label: "Account",
    items: [
      { to: "/employer/company", label: "Company Profile", icon: Building2 },
      // { to: "/employer/billing", label: "Billing & Plans", icon: CreditCard },
      { to: "/employer/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
] as const;

function EmployerLayout() {
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-[#0b1220] text-slate-200 lg:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-4">
          <div className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-sm font-bold tracking-wide">HOPEHIRE.AI</div>
              <div className="text-[11px] text-slate-400">Employer Dashboard</div>
            </div>
          )}
        </div>

        <div className="relative flex-1 overflow-y-auto px-2 py-4">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="absolute -right-3 top-2 grid size-6 place-items-center rounded-full border border-white/10 bg-[#0b1220] text-slate-300 shadow hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn("size-3.5 transition-transform", collapsed && "rotate-180")} />
          </button>

          {sections.map((section) => (
            <div key={section.label} className="mb-5">
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {section.label}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.to || pathname.startsWith(item.to + "/");
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-slate-300 hover:bg-white/5 hover:text-white",
                        collapsed && "justify-center",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => logout()}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white",
              collapsed && "justify-center",
            )}
          >
            <LogOut className="size-4" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/85 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs, candidates, applications..."
              className="h-10 rounded-full bg-muted pl-9"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                4
              </span>
            </button>
            <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5">
              <div className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {(user?.fullName ?? "E").charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-left leading-tight sm:block">
                <div className="text-sm font-semibold">{user?.fullName ?? "Employer"}</div>
                <div className="text-[11px] text-muted-foreground">Employer</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
