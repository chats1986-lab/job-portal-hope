import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          { path: "/", priority: "1.0", changefreq: "weekly" as const },
          { path: "/jobs", priority: "0.9", changefreq: "daily" as const },
          { path: "/auth/login", priority: "0.5", changefreq: "monthly" as const },
          { path: "/auth/signup", priority: "0.5", changefreq: "monthly" as const },
          { path: "/applications", priority: "0.6", changefreq: "weekly" as const },
          { path: "/resumes", priority: "0.6", changefreq: "weekly" as const },
          { path: "/dashboard", priority: "0.5", changefreq: "weekly" as const },
          { path: "/ai-tools", priority: "0.5", changefreq: "monthly" as const },
          { path: "/ai-match", priority: "0.5", changefreq: "weekly" as const },
        ];
        const urls = paths.map(
          (p) =>
            `  <url><loc>${BASE_URL}${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
