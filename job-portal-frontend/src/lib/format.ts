export const formatSalary = (
  min?: number | null,
  max?: number | null,
  currency = "USD",
): string => {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `From ${fmt(min)}`;
  if (max != null) return `Up to ${fmt(max)}`;
  return "Salary not disclosed";
};

export const timeAgo = (iso?: string | null): string => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${days >= 60 ? "s" : ""} ago`;
  return `${Math.floor(days / 365)} year${days >= 730 ? "s" : ""} ago`;
};

export const formatDate = (iso?: string | null): string =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

/** Convert ENUM_CASE → "Enum Case". */
export const humanizeEnum = (v?: string | null): string => {
  if (!v) return "";
  return v
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export const formatJobLocation = (j: {
  city?: string | null;
  state?: string | null;
  country?: string | null;
  workMode?: string | null;
}): string => {
  const parts = [j.city, j.state, j.country].filter(Boolean);
  if (parts.length === 0) return j.workMode === "REMOTE" ? "Remote" : "Location not specified";
  return parts.join(", ");
};
