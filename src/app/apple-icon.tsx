import { ImageResponse } from "next/og";

/**
 * Apple touch icon — generated via Next 16 `apple-icon.tsx` file convention.
 *
 * Same "JF" mark as the favicon, scaled to the 180×180 spec used by iOS home
 * screens. Trust-blue ground + bone glyph, weighted larger so the mark reads
 * at home-screen size.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: "#1D4D7A",
          color: "#F2EBDD",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          borderRadius: 0,
        }}
      >
        JF
      </div>
    ),
    { ...size }
  );
}
