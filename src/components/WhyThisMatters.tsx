import { BodyCopy, DisplayHeading, SectionShell } from "./primitives";

/**
 * WhyThisMatters — COPY-VOICE.md §5 ("This isn't another tool.")
 *
 * Single-column, prose-style. Three paragraphs, generous whitespace per
 * VISUAL-LANGUAGE.md "gallery-quiet, NOT busy-cinematic" rule. The argument
 * (compound now or pay for a fraction; do it yourself in hundreds of hours or
 * with me in four) is doing the work — visual restraint amplifies it.
 *
 * Judgment call: VOICE-DNA flags "compound for years" as an anchor phrase. We
 * leave it inline in primary tone — adding amber-on-the-phrase felt busy
 * (sunset-stripe is reserved per Aviator-Nation discipline; lamp-amber as
 * inline-highlight risked competing with §3's actual gradient moment).
 * Restraint wins.
 */
export function WhyThisMatters() {
  return (
    <SectionShell
      id="why-this-matters"
      scene="why-this-matters"
      ariaLabelledBy="why-this-matters-headline"
      contentWidth="text"
    >
      <DisplayHeading
        as="h2"
        size="lg"
        id="why-this-matters-headline"
        className="mb-10"
      >
        This isn&rsquo;t another tool.
      </DisplayHeading>

      <BodyCopy size="lg" tone="primary" className="mb-6">
        Agentic AI is changing how people work — fast. The operators who set it
        up now will compound for years. The ones who don&rsquo;t will keep
        paying for a fraction of what they have.
      </BodyCopy>

      <BodyCopy size="lg" tone="primary">
        You can do this on your own. It will take you hundreds of hours of
        testing, breaking, and rebuilding to get to where I&rsquo;ll get you in
        four.
      </BodyCopy>
    </SectionShell>
  );
}
