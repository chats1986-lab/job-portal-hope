import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, Globe, Mail, MapPin } from "lucide-react";
import { companiesService } from "@/lib/services/companies.service";

export const Route = createFileRoute("/_employer/employer/company")({
  head: () => ({ meta: [{ title: "Company Profile — Employer" }] }),
  component: CompanyProfile,
});

function CompanyProfile() {
  const companyQuery = useQuery({
    queryKey: ["employer", "company"],
    queryFn: () => companiesService.mine(),
  });

  const c = companyQuery.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Company profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">How candidates see your company.</p>
      </div>

      {companyQuery.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!companyQuery.isLoading && !c && (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
          <Building2 className="mx-auto mb-3 size-8" />
          No company profile yet.
        </div>
      )}

      {c && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start gap-6">
            <div className="grid size-20 place-items-center rounded-2xl bg-muted">
              {c.logoUrl ? (
                <img onError={(e) => (e.currentTarget.src = "/placeholder-company.svg")} src={c.logoUrl} alt={c.name} className="size-full rounded-2xl object-cover" />
              ) : <Building2 className="size-8 text-muted-foreground" />}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-bold">{c.name}</h2>
              {c.tagline && <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {c.website && <span className="inline-flex items-center gap-1"><Globe className="size-3" />{c.website}</span>}
                {c.email && <span className="inline-flex items-center gap-1"><Mail className="size-3" />{c.email}</span>}
                {c.industryType && <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{c.industryType}</span>}
              </div>
            </div>
          </div>
          {c.description && (
            <div className="mt-6 border-t pt-4 text-sm leading-6 text-muted-foreground whitespace-pre-line">{c.description}</div>
          )}
        </div>
      )}
    </div>
  );
}
