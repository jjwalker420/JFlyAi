import type { MetadataRoute } from "next";

/**
 * Robots policy — Next 16 file convention (`app/robots.ts`).
 *
 * Allow all crawlers, point to the sitemap. Single-page V1 has no private
 * routes to disallow; revisit when /admin or staging-gated routes land.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://jfly.ai/sitemap.xml",
    host: "https://jfly.ai",
  };
}
