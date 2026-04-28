import type { MetadataRoute } from "next";

/**
 * Sitemap — Next 16 file convention (`app/sitemap.ts`).
 *
 * V1 site is single-page (home only). When /about, blog, etc. land, append
 * additional entries here. Domain hard-coded to https://jfly.ai per the
 * canonical-domain decision in the build kickoff. `lastModified: new Date()`
 * regenerates per build, which is fine because the file is static-cached.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://jfly.ai",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
