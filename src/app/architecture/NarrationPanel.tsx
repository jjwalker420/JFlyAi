"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { PublicNode } from "@/data/architecture";
import { TIER_NARRATION } from "./narration";

type Props = {
  activeTier: number;        // 1-8 during scroll, 9 = CTA state (schematic complete)
  nodesByTier: Record<number, PublicNode[]>;
};

/**
 * NarrationPanel — right-side copy panel on desktop, in-flow chapter on mobile.
 *
 * On desktop the panel sits inside a sticky scroll-driven container (handled by
 * ArchitectureScene). It receives the active tier and renders the JJ-approved
 * narration sentence + caption + the public node list for that tier.
 *
 * Tier 9 is a synthetic "schematic complete" state that swaps in the CTA copy.
 *
 * Transition between tiers is a short fade + 8px slide; reduced-motion users
 * see an instant swap.
 */
export function NarrationPanel({ activeTier, nodesByTier }: Props) {
  const reduced = useReducedMotion() ?? false;
  const showCTA = activeTier >= 9;
  const tierIndex = Math.min(Math.max(activeTier, 1), 8);
  const narration = TIER_NARRATION[tierIndex - 1];
  const nodes = nodesByTier[tierIndex] ?? [];
  const key = showCTA ? "cta" : `tier-${tierIndex}`;

  return (
    <div className="relative mx-auto flex w-full max-w-[520px] flex-col gap-6 lg:gap-8">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
          transition={{ duration: reduced ? 0 : 0.32, ease: [0.32, 0.72, 0, 1] }}
        >
          {showCTA ? (
            <CTABody />
          ) : (
            <TierBody narration={narration} nodes={nodes} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TierBody({
  narration,
  nodes,
}: {
  narration: (typeof TIER_NARRATION)[number];
  nodes: PublicNode[];
}) {
  return (
    <article aria-live="polite" aria-atomic="true">
      <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-lamp-amber/85">
        Tier {narration.tier} — {narration.publicName}
      </p>

      <p className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-[1.2] text-bone">
        {narration.sentence}
      </p>

      <p className="mt-3 font-mono text-[0.8125rem] leading-[1.5] text-bone/55">
        {narration.caption}
      </p>

      {nodes.length > 0 && (
        <ul className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {nodes.map((n) => (
            <li
              key={n.id}
              className="rounded-md border border-bone/10 bg-bone/[0.02] p-3"
            >
              <p className="font-mono text-[0.75rem] font-medium text-bone/95">
                {n.label}
              </p>
              <p className="mt-1 font-body text-[0.8125rem] leading-[1.45] text-bone/60">
                {n.description}
              </p>
              {n.status === "deferred" && (
                <span className="mt-2 inline-block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-lamp-amber/80">
                  planned
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function CTABody() {
  return (
    <article aria-live="polite" aria-atomic="true">
      <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-lamp-amber/85">
        Schematic complete
      </p>

      <p className="mt-4 font-display text-[clamp(1.5rem,2.8vw,2.125rem)] font-medium leading-[1.2] text-bone">
        This is eleven phases of my own work, in front of you.
      </p>

      <p className="mt-4 font-body text-[1rem] leading-[1.55] text-bone/75">
        The faster path is me at your desk for an afternoon — same machine you
        actually use, same files you actually work on.
      </p>

      <div className="mt-7">
        <Link
          href="https://cal.com/jjwalker"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-sunset-orange px-7 py-4 font-display text-[1.125rem] font-semibold whitespace-nowrap text-ink-black transition-colors duration-200 hover:bg-sunset-yellow"
        >
          <span>Book a 30-min call</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
