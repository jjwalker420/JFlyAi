"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PublicNode } from "@/data/architecture";
import { TIER_NARRATION } from "./narration";
import { TierCanvas } from "./TierCanvas";
import { NarrationPanel } from "./NarrationPanel";

type Arch = {
  tiers: { n: number; name: string }[];
  nodes: PublicNode[];
};

type Props = {
  arch: Arch;
};

/**
 * ArchitectureScene — orchestrator for the /architecture page.
 *
 * Desktop (≥1024px): split-screen with a sticky canvas pinned on the left while
 * the narration panel scrolls past on the right. We use ONE long pinned region
 * (8 tier chapters + 1 CTA chapter) and read native scrollY against the
 * region's bounding rect to compute activeTier. We deliberately avoid Framer
 * Motion's useScroll/useTransform — it has been logged unreliable in this stack.
 *
 * Mobile (<1024px): the canvas is rendered once at the top as a static
 * preview; the narration panel becomes a vertical chapter rhythm with a
 * left-edge progress rail that fills as the user advances.
 *
 * Reduced motion: schematic renders fully assembled, panel updates on scroll
 * via simple intersection (no canvas draw or pulse animations).
 */
export function ArchitectureScene({ arch }: Props) {
  // Tier 0 = unified opening frame (all 8 tiers visible-but-planned).
  // Scrolling into the pinned scene inks in tier 1, then 2 … 8, then 9 = CTA.
  const [activeTier, setActiveTier] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  // Group public nodes by tier once.
  const nodesByTier = useMemo(() => {
    const map: Record<number, PublicNode[]> = {};
    for (const n of arch.nodes) {
      (map[n.tier] ||= []).push(n);
    }
    // Stable ordering by column then id.
    for (const t of Object.keys(map)) {
      map[Number(t)].sort((a, b) =>
        a.column !== b.column ? a.column - b.column : a.id.localeCompare(b.id)
      );
    }
    return map;
  }, [arch.nodes]);

  // Reduced-motion media query.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Native scroll listener — tracks scene progress to derive activeTier.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const TICKS = 9; // 8 tiers + CTA chapter

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const el = sceneRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const total = rect.height - vh;
        if (total <= 0) {
          setActiveTier(0);
          return;
        }
        // Progress = how far into the pinned region we've scrolled. 0..1.
        const raw = Math.min(1, Math.max(0, -rect.top / total));
        // Reserve the first 6% of progress for the "unified opening frame"
        // state (tier 0). After that, ramp through 1..9.
        if (raw < 0.06) {
          setActiveTier(0);
          return;
        }
        const progress = (raw - 0.06) / 0.94;
        const idx = Math.min(TICKS, Math.max(1, Math.floor(progress * TICKS) + 1));
        setActiveTier(idx);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Mobile chapter intersection — observe each chapter and set activeTier on enter.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobile) return;

    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>("[data-arch-chapter]")
    );
    if (chapters.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const t = Number(
          (visible.target as HTMLElement).dataset.archChapter ?? "1"
        );
        setActiveTier(t);
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0.25, 0.5, 0.75] }
    );
    chapters.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  // Canvas accepts 0..8; treat anything ≥9 as 8 (schematic stays complete).
  const cappedTier = Math.min(8, Math.max(0, activeTier));

  return (
    <section
      id="architecture-scene"
      aria-label="Eight-tier AiOS reference architecture"
      className="relative"
    >
      {/* H1 block — large display anchor above the scene.
          The "REFERENCE ARCHITECTURE · 8 TIERS · LIVE" caption lives inside the
          SVG canvas, not here, so it travels with the schematic. */}
      <div className="px-6 pt-28 pb-10 md:pt-36 md:pb-14">
        <div className="mx-auto max-w-[1200px] text-center">
          <h1 className="mx-auto font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-bone">
            An AiOS has 8 layers.
          </h1>
          <p className="mx-auto mt-5 max-w-[640px] font-body text-[1.0625rem] leading-[1.55] text-bone/65">
            Scroll the schematic. Each layer inks in as the narration moves
            through it — eight tiers of operator infrastructure, end to end.
          </p>
        </div>
      </div>

      {/* DESKTOP: pinned split-screen scene
          Outer container is tall — its scroll progress drives activeTier.
          Inner sticky row holds the canvas (left) + narration panel (right).
          Height: 9 chapters × ~75vh each, leaving the closing band to follow. */}
      <div
        ref={sceneRef}
        className="relative hidden lg:block"
        style={{ height: "calc(9 * 75vh)" }}
      >
        <div className="sticky top-0 flex h-screen items-stretch">
          <div className="grid h-full w-full grid-cols-12 gap-10 px-8 xl:px-16">
            {/* Canvas */}
            <div className="col-span-7 flex h-full items-center">
              <div className="h-[92%] w-full">
                <TierCanvas
                  activeTier={cappedTier}
                  nodesByTier={nodesByTier}
                  tierNames={arch.tiers}
                  reducedMotion={reducedMotion}
                />
              </div>
            </div>

            {/* Narration */}
            <div className="col-span-5 flex h-full items-center">
              <div className="w-full">
                <NarrationPanel
                  activeTier={activeTier}
                  nodesByTier={nodesByTier}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: vertical chapter journey with progress rail */}
      <div className="relative lg:hidden">
        {/* Mini schematic — sticky-top, reflects the active tier as the user
            scrolls through the chapters below. Reduced-motion users see it
            fully assembled and static. */}
        <div className="sticky top-16 z-10 mx-auto -mt-2 mb-6 max-w-[460px] px-6">
          <div
            className="rounded-md border border-bone/10 bg-ink-black/85 p-3 backdrop-blur-md"
            aria-hidden="true"
          >
            <div className="aspect-[4/5] w-full">
              <TierCanvas
                activeTier={cappedTier}
                nodesByTier={nodesByTier}
                tierNames={arch.tiers}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>
        </div>

        {/* Progress rail — hairline trust-blue that fills as activeTier rises */}
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-0 h-full w-[2px] bg-bone/8" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-0 w-[2px] bg-trust-blue-tint"
            style={{
              height: `${(Math.min(activeTier, 9) / 9) * 100}%`,
              transition: reducedMotion ? "none" : "height 400ms var(--ease-deliberate)",
            }}
          />

          <ol className="space-y-14 px-6 pl-10 pb-8">
            {TIER_NARRATION.map((tn) => {
              const nodes = nodesByTier[tn.tier] ?? [];
              const isActive = activeTier === tn.tier;
              return (
                <li
                  key={tn.tier}
                  data-arch-chapter={tn.tier}
                  aria-current={isActive ? "step" : undefined}
                  className="scroll-mt-32"
                >
                  <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-lamp-amber/85">
                    Tier {tn.tier} — {tn.publicName}
                  </p>
                  <p className="mt-3 font-display text-[clamp(1.375rem,4.5vw,1.75rem)] font-medium leading-[1.2] text-bone">
                    {tn.sentence}
                  </p>
                  <p className="mt-2 font-mono text-[0.8125rem] leading-[1.5] text-bone/55">
                    {tn.caption}
                  </p>

                  {nodes.length > 0 && (
                    <ul className="mt-5 grid grid-cols-1 gap-2">
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
                </li>
              );
            })}

            {/* Mobile CTA — ends the journey */}
            <li
              data-arch-chapter={9}
              aria-current={activeTier >= 9 ? "step" : undefined}
              className="scroll-mt-32"
            >
              <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-lamp-amber/85">
                Schematic complete
              </p>
              <p className="mt-3 font-display text-[clamp(1.5rem,5vw,1.875rem)] font-medium leading-[1.2] text-bone">
                This is eleven phases of my own work, in front of you.
              </p>
              <p className="mt-3 font-body text-[1rem] leading-[1.55] text-bone/75">
                The faster path is me at your desk for an afternoon — same
                machine you actually use, same files you actually work on.
              </p>
              <Link
                href="https://cal.com/jjwalker"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-sunset-orange px-7 py-4 font-display text-[1.0625rem] font-semibold whitespace-nowrap text-ink-black transition-colors duration-200 hover:bg-sunset-yellow"
              >
                <span>Book a 30-min call</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          </ol>
        </div>
      </div>

      {/* CLOSING BAND — sunset-stripe divider + the second-look CTA */}
      <ClosingBand />
    </section>
  );
}

function ClosingBand() {
  return (
    <section
      aria-labelledby="arch-closing-headline"
      className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32"
    >
      {/* Second appearance of the sunset stripe — divider before the closing band */}
      <div
        aria-hidden="true"
        className="mx-auto mb-14 h-[3px] w-[160px] rounded-full md:mb-20"
        style={{
          background:
            "linear-gradient(90deg, #C5443B 0%, #E07B3F 33%, #E6B547 66%, #C9893E 100%)",
        }}
      />
      <div className="mx-auto max-w-[720px] text-center">
        <h2
          id="arch-closing-headline"
          className="font-display text-[clamp(1.875rem,4vw,2.75rem)] font-medium leading-tight tracking-tight text-bone"
        >
          Stop reading the architecture. Build yours.
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] font-body text-[1.0625rem] leading-[1.55] text-bone/75">
          Thirty minutes on a call. I&rsquo;ll tell you which two layers to
          build first.
        </p>
        <div className="mt-9">
          <Link
            href="https://cal.com/jjwalker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-sunset-orange px-7 py-4 font-display text-[1.125rem] font-semibold whitespace-nowrap text-ink-black transition-colors duration-200 hover:bg-sunset-yellow"
          >
            <span>Book the call</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
