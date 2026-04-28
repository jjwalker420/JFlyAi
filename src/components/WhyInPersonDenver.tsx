import {
  BodyCopy,
  Caption,
  DisplayHeading,
  SectionShell,
} from "./primitives";

/**
 * WhyInPersonDenver — COPY-VOICE.md §7 ("Most AI consulting is online courses
 * and Loom videos.")
 *
 * Single-column, prose-style. The contrast (online courses vs. me at your
 * desk) is the argument; the layout stays out of its way. Denver-base + travel
 * fee note rendered as a Caption below the body — feels like a publication
 * dateline, not a marketing aside.
 */
export function WhyInPersonDenver() {
  return (
    <SectionShell
      id="why-denver"
      scene="why-denver"
      ariaLabelledBy="why-denver-headline"
      contentWidth="text"
    >
      <DisplayHeading
        as="h2"
        size="lg"
        id="why-denver-headline"
        className="mb-10"
      >
        Most AI consulting is online courses and Loom videos.
      </DisplayHeading>

      <BodyCopy size="lg" tone="primary" className="mb-10">
        Mine isn&rsquo;t. I show up, sit at your desk, and install the system
        at your hands. Same machine you actually work on. Same files you
        actually use. Four hours in person beats four weeks of self-paced video
        by an order of magnitude.
      </BodyCopy>

      <Caption tone="muted">
        Based in Denver. Travel fees apply outside the metro area.
      </Caption>
    </SectionShell>
  );
}
