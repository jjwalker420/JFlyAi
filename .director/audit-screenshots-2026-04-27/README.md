# Stage 5 Audit — Visual Proof (2026-04-27)

Screenshots captured during the Stage 5 launch audit are embedded inline in
the audit transcript at `.director/stage-5-audit-2026-04-27.md` (the agent
report). The Claude Preview MCP returned compressed JPEG screenshots inline
in the audit conversation — they were not written to this directory because
the preview MCP returns image data as inline tool output rather than file
writes.

## Captures performed

- Desktop (1280×800) at scroll 0 — hero with full Time Machine canvas, JFly.ai
  wordmark, mechanism strip
- Desktop (1280×800) at #services anchor — "Three ways in." headline, AiOS
  AUDIT pricing card with the AiOS spelling fix verified visually (lowercase i
  preserved, AUDIT in caps)
- Mobile (375×812) at scroll 0 — full hero copy, CTA button, "See what's
  included" link, mechanism strip beginning

## Visual confirmations

1. Hero image (time-machine-hero.png) renders via next/image — confirmed in
   network tab as `image?url=%2Ftime-machine-hero.png&w=3840&q=75` (Next 16
   image optimization active, served as compressed WebP/AVIF based on Accept
   header).
2. AiOS spelling preserved in pricing card eyebrows — "AiOS AUDIT" / "AiOS
   SETUP" both render with lowercase i (Fix 2 verified).
3. JFly.ai header wordmark — lowercase ai per brand spelling lock.
4. Trust-blue-tint price displays — accessible at WCAG AA contrast.
5. Sunset-stripe accent on AiOS gradient text in hero — signature element used
   correctly (NOT as background fill).
</content>
