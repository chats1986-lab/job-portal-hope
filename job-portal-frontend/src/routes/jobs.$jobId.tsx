import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs/$jobId")({
  component: JobRouteLayout,
});

function JobRouteLayout() {
  return <Outlet />;
}
