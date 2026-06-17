import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth/context";
import { ApiError } from "@/lib/api/client";
import { UserRole } from "@/types";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Log in — HireMe" }] }),
  component: LoginPage,
});

function redirectForRole(role: UserRole | string | null | undefined): string {
  switch (role) {
    case UserRole.ROLE_ADMIN:
      return "/admin";
    case UserRole.ROLE_EMPLOYER:
      return "/employer/dashboard";
    case UserRole.ROLE_JOB_SEEKER:
    default:
      return "/dashboard";
  }
}

function LoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.ROLE_JOB_SEEKER);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password });
      const actualRole = res.user?.role;
      if (actualRole && actualRole !== role) {
        logout();
        toast.error(
          `This account is registered as ${labelForRole(actualRole)}, not ${labelForRole(role)}.`,
        );
        return;
      }
      toast.success(res.message ?? "Welcome back!");
      navigate({ to: redirectForRole(actualRole ?? role) });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Could not sign in";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Log in to continue your job search.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="role">Log in as</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger id="role" className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ROLE_JOB_SEEKER}>Candidate</SelectItem>
                  <SelectItem value={UserRole.ROLE_EMPLOYER}>Employer</SelectItem>
                  <SelectItem value={UserRole.ROLE_ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />} Log in
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function labelForRole(role: UserRole | string): string {
  switch (role) {
    case UserRole.ROLE_ADMIN:
      return "Admin";
    case UserRole.ROLE_EMPLOYER:
      return "Employer";
    case UserRole.ROLE_JOB_SEEKER:
      return "Candidate";
    default:
      return String(role);
  }
}
