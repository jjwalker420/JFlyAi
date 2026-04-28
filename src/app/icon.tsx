import { ImageResponse } from "next/og";

/**
 * Brand favicon — generated via Next 16 `icon.tsx` file convention.
 *
 * "JF" mark in bone (#F2EBDD) on a trust-blue (#1D4D7A) ground, set in the
 * display serif voice (Fraunces is loaded for the page; the ImageResponse
 * runtime falls back to the bundled "Geist" sans, which keeps the mark
 * legible at 32×32 since serif glyphs flatten at this size). Trust-blue is
 * the primary brand color per VISUAL-LANGUAGE.md / globals.css.
 *
 * App icons are statically optimized at build time per Next 16 — this runs
 * once and the PNG is cached for the life of the build.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "#1D4D7A",
          color: "#F2EBDD",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        JF
      </div>
    ),
    { ...size }
  );
}
