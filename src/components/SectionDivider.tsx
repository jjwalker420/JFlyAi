/**
 * SectionDivider — sunset-stripe horizontal accent between major beats.
 *
 * Aviator discipline (CLAUDE.md hard rule #3): the sunset stripe is the
 * brand's signature stamp. Used SPARINGLY at transition moments — never as
 * background fill, never between every section. If it shows up everywhere,
 * it stops meaning anything.
 *
 * Locked uses (page.tsx, 2026-04-27 PM):
 *   - Between Hero and DiagnosticTest (entry into the page argument)
 *   - Between WhatSetupMeans and CTA (entry into the close)
 *
 * Faded edges via mask-image so the band doesn't fight the section padding.
 * Kept thin (3px) and 50% opacity so it punctuates rather than dominates.
 */
export function SectionDivider() {
  return (
    <div className="px-6 py-2">
      <div
        aria-hidden="true"
        className="mx-auto h-[3px] w-full max-w-[640px] rounded-full opacity-55 [mask-image:linear-gradient(to_right,transparent_0%,black_22%,black_78%,transparent_100%)]"
        style={{
          background:
            "linear-gradient(90deg, var(--color-sunset-red), var(--color-sunset-orange), var(--color-sunset-yellow), var(--color-sunset-gold))",
        }}
      />
    </div>
  );
}
