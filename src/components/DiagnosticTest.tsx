"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BodyCopy, DisplayHeading, SectionShell } from "./primitives";

/**
 * DiagnosticTest — COPY-VOICE.md §3 ("A quick check.")
 *
 * Architectural beat: the 6 jargon terms ARE the diagnostic. Render them as a
 * visually distinct list so the reader scans, recognizes (or doesn't), and the
 * argument lands without selling.
 *
 * Final beat ("leaving 90% on the table") gets a sunset-stripe gradient sweep
 * on first scroll-into-view (P1.c refinement, 2026-04-27 PM). The text starts
 * bone-colored and the sunset gradient sweeps in left-to-right via animated
 * background-position-x. Uses a 200%-wide composite gradient
 * [sunset → sunset → sunset → bone → bone] panned from "right-aligned" to
 * "left-aligned" so the colored half slides into the visible window.
 *
 * Reduced-motion users get the resting (full-sunset) state without animation
 * via a runtime branch on `useReducedMotion`.
 */

const TERMS = [
  "Context Window",
  "Agentic Skills",
  "Markdown (.md)",
  "Model Context Protocol (MCP)",
  "Subagents",
  "Hooks",
];

const SUNSET_PHRASE = "leaving 90% of what these tools can do on the table";

export function DiagnosticTest() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionShell
      id="diagnostic"
      scene="diagnostic"
      ariaLabelledBy="diagnostic-headline"
      contentWidth="text"
    >
      <DisplayHeading
        as="h2"
        size="lg"
        id="diagnostic-headline"
        className="mb-10"
      >
        A quick check.
      </DisplayHeading>

      <BodyCopy size="lg" tone="primary" className="mb-3">
        If you&rsquo;re using ChatGPT.com but haven&rsquo;t installed Claude or
        ChatGPT desktop —
      </BodyCopy>
      <BodyCopy size="lg" tone="primary" className="mb-8">
        If you haven&rsquo;t heard of, or can&rsquo;t explain:
      </BodyCopy>

      {/*
        The list is intentionally not bulleted-with-discs — the terms themselves
        are the signal. Italic per §3 source. Mono accent on each row gives the
        "command-deck" voice without competing with the headline.
      */}
      <ul
        className="mb-10 flex flex-col gap-3 border-l border-bone/20 pl-6"
        aria-label="Six terms that mark the diagnostic"
      >
        {TERMS.map((term) => (
          <li
            key={term}
            className="font-mono italic text-bone text-[1.0625rem] leading-snug"
          >
            {term}.
          </li>
        ))}
      </ul>

      <BodyCopy size="lg" tone="primary">
        — you&rsquo;re{" "}
        {prefersReducedMotion ? (
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-yellow font-semibold">
            {SUNSET_PHRASE}
          </span>
        ) : (
          <motion.span
            initial={{ backgroundPositionX: "100%" }}
            whileInView={{ backgroundPositionX: "0%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease: [0.32, 0.72, 0, 1] }}
            className="font-semibold text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--color-sunset-red) 0%, var(--color-sunset-orange) 18%, var(--color-sunset-yellow) 36%, var(--color-bone) 50%, var(--color-bone) 100%)",
              backgroundSize: "200% 100%",
              backgroundRepeat: "no-repeat",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            {SUNSET_PHRASE}
          </motion.span>
        )}
        .
      </BodyCopy>
    </SectionShell>
  );
}
