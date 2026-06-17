import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Sparkles, Target, UserRound } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/atoms/Logo";
import { HeaderSearchBar } from "@/components/organisms/HeaderSearchBar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof Sparkles | null };
const navItems: NavItem[] = [
  { to: "/jobs", label: "Jobs", icon: null },
];

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop search */}
        <div className="hidden flex-1 lg:flex">
          <HeaderSearchBar />
        </div>

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {Icon && <Icon className="size-4" />}
                {item.label}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="relative ml-1 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="ml-1 grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground hover:bg-accent"
                    aria-label="Account"
                  >
                    <UserRound className="size-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="text-sm font-semibold">{user?.fullName ?? "Account"}</div>
                    <div className="truncate text-xs font-normal text-muted-foreground">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/dashboard">Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/applications">My Applications</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/saved-jobs">Saved Job</Link></DropdownMenuItem>

                  <DropdownMenuItem asChild><Link to="/resume-builder">My Resumes</Link></DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild><Link to="/admin">Admin Console</Link></DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="size-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link to="/auth/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link to="/auth/signup"><Button size="sm">Sign up</Button></Link>
            </div>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="grid size-10 place-items-center rounded-xl border bg-card text-foreground hover:bg-muted"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto p-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 p-4">
                <div className="space-y-2">
                  <HeaderSearchBar />
                </div>
                <nav className="flex flex-col">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium",
                          active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                        )}
                      >
                        {Icon && <Icon className="size-5" />}
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t pt-4">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2">
                        <div className="text-sm font-semibold">{user?.fullName ?? "Account"}</div>
                        <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
                      </div>
                      <Link to="/dashboard" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-muted">Dashboard</Link>
                      <Link to="/applications" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-muted">My Applications</Link>
                      <Link to="/resume-builder" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-muted">My Resumes</Link>
                      <button
                        type="button"
                        onClick={() => { logout(); setOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="size-4" /> Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/auth/login" onClick={() => setOpen(false)}><Button variant="outline" className="w-full">Log in</Button></Link>
                      <Link to="/auth/signup" onClick={() => setOpen(false)}><Button className="w-full">Sign up</Button></Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile inline search below header bar on md screens (tablets) */}
      <div className="border-t bg-background/70 px-4 py-2 md:px-6 lg:hidden">
        <HeaderSearchBar />
      </div>
    </header>
  );
}
