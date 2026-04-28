import type { MetadataRoute } from "next";

/**
 * Web app manifest — Next.js 16 file-based convention (`app/manifest.ts`).
 *
 * Defines installability metadata (name, icons, colors, display mode) served
 * at /manifest.webmanifest. Follows the same pattern as `app/robots.ts` and
 * `app/sitemap.ts` in this project.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JFly.ai",
    short_name: "JFly.ai",
    description: "JJ Walker builds your AiOS — Denver",
    start_url: "/",
    display: "standalone",
    background_color: "#0E0C0A",
    theme_color: "#D9933A",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
