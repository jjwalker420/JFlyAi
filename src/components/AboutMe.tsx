import Image from "next/image";
import {
  BodyCopy,
  Caption,
  DisplayHeading,
  SectionShell,
} from "./primitives";

/**
 * AboutMe — COPY-VOICE.md §4 ("I'm JJ Walker.")
 *
 * Two-column on md+: editorial portrait LEFT, copy + outcome metrics RIGHT.
 * Stacks on mobile (portrait above copy).
 *
 * PORTRAIT IS A LAUNCH BLOCKER. JJ doesn't have one yet (1-hour Denver
 * photographer session, $300–500 — see CLAUDE.md "Flexes" + cartography asset
 * notes). Until the shoot lands, render an explicit placeholder block:
 *   - Ink-black ground with bone hairline border at 4:5 portrait aspect ratio.
 *   - data-placeholder="portrait" attribute so design QA + axe pass can find it.
 *   - Dev-only banner ("Editorial portrait — Denver photo session pending")
 *     visible only outside production builds via process.env.NODE_ENV check.
 *     This makes the gap loud at dev/staging time without leaking placeholder
 *     copy to live customers.
 *
 * Outcome metrics ("20+ hrs/wk saved" + "10x output quality") render as two
 * stat blocks below the bio paragraph. trust-blue numbers per JJ's spec
 * (factual highlights = trust signal, not signature signal — sunset-stripe is
 * reserved for §3 + retainer card per VISUAL-LANGUAGE.md discipline).
 */

const STATS = [
  { value: "20+", unit: "hrs/wk", label: "Saved" },
  { value: "10×", unit: "", label: "Output quality" },
] as const;

export function AboutMe() {
  return (
    <SectionShell
      id="about"
      scene="about"
      ariaLabelledBy="about-headline"
      contentWidth="wide"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[5fr_7fr] md:items-start md:gap-16">
        {/* LEFT — editorial portrait */}
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
            <Image
              src="/jj-walker-portrait.png"
              alt="JJ Walker"
              fill
              sizes="(max-width: 768px) 100vw, 502px"
              quality={90}
              className="object-cover object-top opacity-75"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-black/60 to-transparent p-5">
              <Caption tone="muted">JJ Walker · Denver, CO</Caption>
            </div>
          </div>
        </div>

        {/* RIGHT — bio copy + outcome stats */}
        <div>
          <DisplayHeading
            as="h2"
            size="lg"
            id="about-headline"
            className="mb-8"
          >
            I&rsquo;m JJ Walker.
          </DisplayHeading>

          <BodyCopy size="lg" tone="primary" className="mb-6">
            Non-technical founder. 25 years building businesses. 3 exits. A
            20-year event business I still run.
          </BodyCopy>

          <BodyCopy size="lg" tone="primary" className="mb-6">
            Six months ago, agentic AI fundamentally changed how I work. I went
            from ChatGPT-in-a-browser-tab to running 6 agentic systems that
            save me 20+ hours a week and 10x my output quality.
          </BodyCopy>

          <BodyCopy size="lg" tone="primary" className="mb-12">
            Now I install that setup for other operators like me — non-technical,
            busy, allergic to AI hype, ready to compound for the next decade.
          </BodyCopy>

          {/* Outcome stats — trust-blue numbers, bone caption labels */}
          <dl
            className="grid grid-cols-1 gap-8 border-t border-bone/15 pt-10 sm:grid-cols-2"
            aria-label="Outcome metrics from JJ's own AiOS"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <div className="flex items-baseline gap-2">
                    <DisplayHeading as="p" size="lg" tone="trust">
                      {stat.value}
                    </DisplayHeading>
                    {stat.unit ? (
                      // text-trust-blue-tint (not trust-blue/80): same a11y
                      // reasoning as DisplayHeading.tone="trust" — primary
                      // trust-blue fails 3:1 on ink-black, the tint variant
                      // clears it. Dropping /80 opacity for the same reason.
                      <span className="font-display text-[1.5rem] font-semibold text-trust-blue-tint">
                        {stat.unit}
                      </span>
                    ) : null}
                  </div>
                  <Caption tone="muted" className="mt-2">
                    {stat.label}
                  </Caption>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SectionShell>
  );
}
