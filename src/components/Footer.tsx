import { BodyCopy, Caption, TextLink } from "./primitives";
import { DenverClock } from "./DenverClock";

/**
 * Footer — COPY-VOICE.md §10 ("Requirements / Travel / brand attribution")
 *
 * Three blocks. Requirements + Travel are NEW content (didn't exist in Stage
 * 4 footer). Honest gating up front so the wrong prospect self-selects out
 * before booking. Brand attribution at the base.
 *
 * Preserves <footer role="contentinfo"> semantic landmark. No skip-link or
 * nav present in the prior footer — kept the structure flat. Scoped link
 * navigation lives in Header.tsx (owned by Hero Reframer agent this phase),
 * which is the right place for it per Klaassens-restraint.
 */
function PyramidMark() {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      aria-hidden="true"
      className="inline-block"
    >
      <path
        d="M9 1 L17 15 L1 15 Z"
        stroke="#D9933A"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-bone/15 bg-ink-black px-6 py-20"
      aria-labelledby="footer-attribution"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
        {/* Block 1 — Requirements (Apple Silicon only, macOS 12+) */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <Caption tone="trust" className="mb-3">
              Requirements
            </Caption>
            <BodyCopy size="base" tone="primary">
              Apple Silicon Mac (M1 / M2 / M3 / M4), macOS 12 or later. I
              don&rsquo;t work on Windows machines or Intel Macs — these tools
              aren&rsquo;t fast enough on older hardware to be worth your money.
            </BodyCopy>
          </div>

          {/* Block 2 — Travel */}
          <div>
            <Caption tone="trust" className="mb-3">
              Travel
            </Caption>
            <BodyCopy size="base" tone="primary">
              Inside Denver metro included. Outside the metro: travel fee
              quoted on the call.
            </BodyCopy>
          </div>
        </div>

        {/* Sunset-stripe signature divider — single 4px band, NOT a fill */}
        <div aria-hidden="true" className="sunset-stripe w-24" />

        {/* Block 3 — Brand attribution */}
        <div className="flex flex-col gap-3">
          {/* Line 1: Pyramid mark + attribution */}
          <p id="footer-attribution" className="flex items-center gap-2 font-display text-[1rem] font-medium text-bone">
            <PyramidMark />
            <span>JFly.ai</span>
            <span className="text-bone/70">— a consulting practice run by JJ Walker. Denver, Colorado.</span>
          </p>

          {/* Line 2: Social / contact / legal links */}
          <div className="flex flex-wrap items-center gap-1 font-body text-[0.875rem]">
            <a
              href="https://www.linkedin.com/in/jjwalkerdenver/"
              target="_blank"
              rel="noopener noreferrer me"
              className="text-bone/70 underline-offset-4 transition-colors duration-200 hover:text-trust-blue"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <span aria-hidden="true" className="text-bone/30"> · </span>
            <a
              href="mailto:jj@jfly.ai"
              className="text-bone/70 underline-offset-4 transition-colors duration-200 hover:text-trust-blue"
            >
              jj@jfly.ai
            </a>
            <span aria-hidden="true" className="text-bone/30"> · </span>
            <TextLink href="/architecture" tone="muted">Architecture</TextLink>
            <span aria-hidden="true" className="text-bone/30"> · </span>
            <TextLink href="/privacy" tone="muted">Privacy</TextLink>
          </div>

          {/* Line 3: Copyright + DenverClock (bottom-right) */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-[0.75rem] text-bone/50">
              © 2026 JFly.ai&nbsp;&nbsp;·&nbsp;&nbsp;Apple Silicon Mac M1–M4 only&nbsp;&nbsp;·&nbsp;&nbsp;Travel fee outside Denver metro
            </p>
            <DenverClock />
          </div>
        </div>
      </div>
    </footer>
  );
}
