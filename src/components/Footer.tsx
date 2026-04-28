import { BodyCopy, Caption } from "./primitives";

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
        <p
          id="footer-attribution"
          className="font-display text-[1rem] font-medium text-bone"
        >
          <span className="text-bone">JFly.ai</span>
          <span className="text-bone/70">
            {" "}
            — a consulting practice run by JJ Walker. Denver, Colorado.
          </span>
        </p>
      </div>
    </footer>
  );
}
