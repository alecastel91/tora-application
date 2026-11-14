import type { MetadataRoute } from "next";
import { fetchPublicSlugs } from "@/lib/publicProfile";

const BASE = "https://www.torahub.io";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    { path: "/support", priority: 0.3 },
  ];
  const pages: MetadataRoute.Sitemap = routes.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));
  // Every live public artist page (torahub.io/@slug).
  const profiles = await fetchPublicSlugs();
  return pages.concat(profiles.map((p) => ({
    url: `${BASE}/@${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  })));
}
