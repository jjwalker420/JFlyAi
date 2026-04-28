import { ImageResponse } from "next/og";

/**
 * OG social card — generated via Next 16 `opengraph-image.tsx` file convention.
 *
 * Rendered when someone shares https://www.jfly.ai on Twitter, LinkedIn, Slack, etc.
 * 1200×630 per the OG spec.
 *
 * Brand palette (VISUAL-LANGUAGE.md / globals.css):
 *   ink-black   #0E0C0A   background
 *   bone        #F2EBDD   wordmark + headline body text
 *   lamp-amber  #D9933A   "AiOS" span + subtitle
 *   trust-blue  #1D4D7A   horizontal accent rule
 *
 * Font: ImageResponse runtime does not auto-load Google Fonts. Fraunces (the
 * display serif used on the page) is unavailable in this runtime. Using the
 * `serif` generic family as the documented safe fallback per AGENTS.md guidance
 * to prefer system fallbacks over guessing at APIs.
 *
 * Statically optimized at build time — runs once, PNG cached for the build lifetime.
 */

export const alt = "JJ Walker builds your AiOS.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0E0C0A",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px 0 64px",
          position: "relative",
        }}
      >
        {/* Top-left wordmark */}
        <div
          style={{
            color: "#F2EBDD",
            fontSize: 28,
            fontWeight: 400,
            fontFamily: "serif",
            letterSpacing: "0.02em",
            marginBottom: "auto",
          }}
        >
          JFly.ai
        </div>

        {/* Main headline — centered vertically in the remaining space */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-end",
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "serif",
            lineHeight: 1.1,
            color: "#F2EBDD",
            paddingBottom: "80px",
          }}
        >
          <span>JJ Walker builds your&nbsp;</span>
          <span style={{ color: "#D9933A" }}>AiOS.</span>
        </div>

        {/* Horizontal accent rule — trust-blue, 3px, full width, ~120px from bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 0,
            width: "100%",
            height: 3,
            background: "#1D4D7A",
          }}
        />

        {/* Subtitle — bottom-left, lamp-amber, monospace, widened tracking */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            left: 64,
            color: "#D9933A",
            fontSize: 18,
            fontFamily: "monospace",
            fontWeight: 400,
            letterSpacing: "0.2em",
          }}
        >
          DENVER · AiOS · INSTALL
        </div>
      </div>
    ),
    { ...size }
  );
}
