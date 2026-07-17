import type { MetadataRoute } from "next";

const BASE = "https://www.torahub.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/apply", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/roles", priority: 0.7 },
    { path: "/features", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/data-deletion", priority: 0.3 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));
}
