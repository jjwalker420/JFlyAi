import { BodyCopy, DisplayHeading, SectionShell } from "./primitives";

/**
 * WhatSetupMeans — COPY-VOICE.md §8 ("What 'Setup' actually means.")
 *
 * 5-bullet contract. Each row is a concrete deliverable JJ leaves behind after
 * the 4-hour session. Trust-blue marker (em-dash glyph) on each row signals
 * "this is real, this is contractual" — chose trust over signature here
 * because the bullets are factual checklist items, and signature/sunset is
 * already booked for §3 + §6 retainer card per Aviator-Nation discipline.
 *
 * Semantic <ul> + <li> for screen readers. Marker is decorative (aria-hidden)
 * so the list reads cleanly through assistive tech.
 */

const DELIVERABLES = [
  "Claude desktop, ChatGPT desktop, and AntiGravity installed and configured",
  "A clean folder structure that your AI agents can actually navigate",
  "Your most-used integrations connected (Gmail, Calendar, Notion, Slack, your CRM)",
  "One automation already running — usually the one that saves the most hours",
  "A 30-day support window so you don’t get stuck",
];

export function WhatSetupMeans() {
  return (
    <SectionShell
      id="setup"
      scene="setup"
      ariaLabelledBy="setup-headline"
      contentWidth="text"
    >
      <DisplayHeading
        as="h2"
        size="lg"
        id="setup-headline"
        className="mb-8"
      >
        What &ldquo;Setup&rdquo; actually means.
      </DisplayHeading>

      <BodyCopy size="lg" tone="primary" className="mb-10">
        When I leave your desk after four hours, you&rsquo;ll have:
      </BodyCopy>

      <ul className="flex flex-col gap-5">
        {DELIVERABLES.map((item) => (
          <li key={item} className="flex gap-4">
            <span
              aria-hidden="true"
              className="mt-[0.55rem] inline-block h-px w-5 shrink-0 bg-trust-blue"
            />
            <span className="font-body text-[1.0625rem] leading-[1.55] text-bone">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
