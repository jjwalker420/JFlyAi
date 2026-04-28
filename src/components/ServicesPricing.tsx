import type { ReactNode } from "react";
import {
  BodyCopy,
  Caption,
  DisplayHeading,
  Eyebrow,
  SectionShell,
} from "./primitives";

/**
 * ServicesPricing — COPY-VOICE.md §6 ("Three ways in.")
 *
 * Three pricing cards (Audit / Setup / Retainer) + founding-cohort line.
 * Architectural beats:
 *   - Cards composed of primitives only; no marketing-card tropes.
 *   - Native <details>/<summary> for expand-on-click — zero JS, full keyboard
 *     a11y, screen readers handle disclosure semantics natively.
 *   - Glass elevation reuses .glass-mission (Agent 2 retuned it to trust-blue
 *     tint per Time Machine direction — no custom card surface needed).
 *   - Retainer card distinguished by a 4px sunset-stripe top accent
 *     (.sunset-stripe utility — locked Aviator-discipline signature, NEVER
 *     used as background fill).
 *   - Expand uses --ease-deliberate motion token; no bounce, no flip, just a
 *     gentle chevron rotation + accordion reveal.
 *
 * Copy is byte-for-byte verbatim from COPY-VOICE.md §6 + Service Offer
 * Specifications. AiOS spelling: lowercase i, every time (CLAUDE.md hard rule).
 */

type Card = {
  /**
   * Service name as a renderable node so the AiOS substring can opt out of
   * the Eyebrow's `uppercase` text-transform. CLAUDE.md hard rule #1: AiOS,
   * lowercase i, ALWAYS — never AIOS. Cards needing the AiOS spelling wrap
   * just that word in <span className="normal-case">AiOS</span>; the rest of
   * the label still renders as the eyebrow caps treatment.
   */
  name: ReactNode;
  /**
   * Plain-text version of the name used as the React key + as the
   * accessibility label so screen readers announce the spelling correctly
   * regardless of CSS text-transform.
   */
  nameText: string;
  /** Price string (DisplayHeading, Trust Blue). */
  price: string;
  /** "/ mo" suffix shown only on retainer card. */
  priceSuffix?: string;
  /** One-line "what" summary from the Section 6 table — visible by default. */
  summary: string;
  /** Full deliverables — revealed on expand. */
  deliverables: ReactNode;
  /** Retainer-only: render sunset-stripe top accent. */
  hasSunsetAccent?: boolean;
};

const CARDS: Card[] = [
  {
    name: (
      <>
        <span className="normal-case">AiOS</span> Audit
      </>
    ),
    nameText: "AiOS Audit",
    price: "$599",
    summary:
      "1-hour recorded call · 30-min questionnaire · 15–30 min final call · Custom report (your AiOS plan, recommended LLM, integration tools, DIY path)",
    deliverables: (
      <ul className="flex list-disc flex-col gap-2 pl-5 text-bone/80 marker:text-trust-blue">
        <li>1 hour recorded video call</li>
        <li>30-minute customized questionnaire delivered after the call</li>
        <li>15&ndash;30 minute final clarifying call</li>
        <li>
          Custom written report including:
          <ul className="mt-2 flex list-[circle] flex-col gap-1.5 pl-5 text-bone/70">
            <li>
              Foundational agentic AI structure customized for client&rsquo;s
              business and work style
            </li>
            <li>Recommended LLM model</li>
            <li>Recommended integration tools</li>
            <li>
              Self-implementation path for clients with time + patience + minor
              dev skills
            </li>
          </ul>
        </li>
      </ul>
    ),
  },
  {
    name: (
      <>
        <span className="normal-case">AiOS</span> Setup
      </>
    ),
    nameText: "AiOS Setup",
    price: "$1,299",
    summary:
      "4-hour in-person session at your desk · Tool installation · Desktop file structure · 1 high-value automation · Saves you 100+ hours of trial-and-error",
    deliverables: (
      <ul className="flex list-disc flex-col gap-2 pl-5 text-bone/80 marker:text-trust-blue">
        <li>4-hour in-person setup session at client&rsquo;s desk</li>
        <li>
          Tool installation: Claude desktop, ChatGPT desktop, AntiGravity
        </li>
        <li>Desktop file structure setup</li>
        <li>
          Most-used integrations connected (Gmail, Calendar, Notion, Slack,
          CRM)
        </li>
        <li>1 high-value automation deployed and running</li>
        <li>30-day support window post-session</li>
        <li>
          Outcome promise: saves the client 100+ hours of trial-and-error
        </li>
      </ul>
    ),
  },
  {
    name: "Ongoing Retainer",
    nameText: "Ongoing Retainer",
    price: "$999",
    priceSuffix: "/ mo",
    summary:
      "Monthly 1-hour optimization session · Slack support · New tool/skill/MCP integrations as Anthropic ships them · Quarterly strategy review",
    hasSunsetAccent: true,
    deliverables: (
      <ul className="flex list-disc flex-col gap-2 pl-5 text-bone/80 marker:text-trust-blue">
        <li>
          1&times; monthly 1-hour optimization session (in person if Denver,
          video otherwise)
        </li>
        <li>Slack / email support throughout the month</li>
        <li>
          New tool / skill / MCP integrations as Anthropic ships them
        </li>
        <li>Quarterly strategy review</li>
      </ul>
    ),
  },
];

export function ServicesPricing() {
  return (
    <SectionShell
      id="services"
      scene="services"
      ariaLabelledBy="services-heading"
      contentWidth="wide"
    >
      <DisplayHeading
        as="h2"
        size="lg"
        id="services-heading"
        className="mb-12 md:mb-16"
      >
        Three ways in.
      </DisplayHeading>

      <ul
        className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
        aria-label="Three service tiers"
      >
        {CARDS.map((card) => (
          <li key={card.nameText} className="flex">
            <ServiceCard card={card} />
          </li>
        ))}
      </ul>

      <p className="mt-12 text-center font-body text-[0.95rem] italic text-bone/60 md:mt-14">
        Founding cohort pricing through summer 2026.
      </p>
    </SectionShell>
  );
}

function ServiceCard({ card }: { card: Card }) {
  return (
    <article
      aria-label={card.nameText}
      className="glass-mission relative flex w-full flex-col overflow-hidden p-8 md:p-10"
    >
      {/*
        Sunset-stripe top accent — retainer card only. 4px gradient bar pinned
        to the top edge. Discipline (CLAUDE.md hard rule #3): NEVER used as
        background fill — only as signature accent. Aria-hidden because the
        meaning is conveyed by the "Ongoing Retainer" label itself.
      */}
      {card.hasSunsetAccent && (
        <div
          aria-hidden="true"
          className="sunset-stripe absolute inset-x-0 top-0 rounded-none"
        />
      )}

      <Eyebrow tone="amber" className="mb-5">
        {card.name}
      </Eyebrow>

      <div className="mb-5 flex items-baseline gap-2">
        <DisplayHeading as="p" size="md" tone="trust">
          {card.price}
        </DisplayHeading>
        {card.priceSuffix && (
          <Caption tone="muted" className="normal-case tracking-normal">
            {card.priceSuffix}
          </Caption>
        )}
      </div>

      <BodyCopy size="base" tone="primary" className="mb-6 flex-1">
        {card.summary}
      </BodyCopy>

      {/*
        Native <details>/<summary> — full keyboard a11y (Tab + Enter/Space),
        screen readers announce disclosure state, zero JS overhead.
        Group `[&_svg]:open:rotate-90` rotates the chevron when expanded.
        Reveal animation kept gentle per Severance-deliberate motion pole.
      */}
      <details className="group [&[open]_.details-body]:mt-5">
        <summary
          className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-md py-2 font-mono text-[0.78rem] uppercase tracking-[0.18em] text-lamp-amber transition-colors duration-200 hover:text-bone focus-visible:outline-none [&::-webkit-details-marker]:hidden"
          style={{ transitionTimingFunction: "var(--ease-deliberate)" }}
        >
          <span className="select-none">
            <span className="group-open:hidden">What&rsquo;s included</span>
            <span className="hidden group-open:inline">Hide details</span>
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className="h-3 w-3 shrink-0 transition-transform duration-300 group-open:rotate-90"
            style={{ transitionTimingFunction: "var(--ease-deliberate)" }}
          >
            <path
              d="M3 1.5 L8 6 L3 10.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>

        <div className="details-body border-t border-bone/15 pt-5 font-body text-[0.95rem] leading-[1.6]">
          {card.deliverables}
        </div>
      </details>
    </article>
  );
}
