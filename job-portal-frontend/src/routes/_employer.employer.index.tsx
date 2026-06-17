import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_employer/employer/")({
  beforeLoad: () => {
    throw redirect({ to: "/employer/dashboard" });
  },
});
