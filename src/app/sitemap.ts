import type { MetadataRoute } from "next";

/**
 * Sitemap — Next 16 file convention (`app/sitemap.ts`).
 *
 * V1 site is single-page (home only). When /about, blog, etc. land, append
 * additional entries here. Domain canonical is https://www.jfly.ai (www).
 * `lastModified: new Date()` regenerates per build — fine because static-cached.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.jfly.ai",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://www.jfly.ai/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://www.jfly.ai/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
