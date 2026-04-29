"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { MechanismStrip } from "./MechanismStrip";
import {
  DisplayHeading,
  BodyCopy,
  PrimaryButtonLink,
  TextLink,
} from "./primitives";

/**
 * Hero — owns the sticky-canvas scroll mechanic.
 *
 * Scroll zone revised 2026-04-27 PM (P2.5 refinement): 250vh → 180vh. The
 * original 250vh left ~50vh of canvas-only space with no copy after the
 * fade-out at scrollProgress 0.8, reading as dead air. 180vh keeps the
 * scroll journey substantial (image saturates, lamp warms, copy fades) while
 * the section unsticks faster so DiagnosticTest enters sooner.
 *
 * Treatment (V1, single-frame): the canonical Time Machine image is the hero.
 * Two close states crossfade across the 180vh travel:
 *   - Resting state (scroll = 0): slightly desaturated, dimmer overall, amber
 *     light sits soft (1985-side dominant feel).
 *   - Lit state (scroll = 1): full saturation, modest scale-up, lamp-amber
 *     vignette intensifies (the room "warms up" as you travel through time).
 *
 * Reduced-motion: render the static image at the lit-state resting position;
 * disable scroll-driven transforms (handled by useReducedMotion + globals.css
 * `prefers-reduced-motion: reduce` block).
 *
 * Two-frame split (1985-only / 2026-only crops + spark bridge) was the second
 * implementation path in HERO-IMAGE-BRIEF.md — out of scope for V1 because it
 * requires image-cropping work + bridge particle system. Defer to V2.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 0.5,
  });

  // Canvas treatment: image stays put, atmosphere shifts.
  // Saturation/brightness filter walks from "dim past" → "warm present"
  // over the 250vh travel. CSS filter applied directly to the image layer.
  const imgFilter = useTransform(
    smoothProgress,
    [0, 1],
    ["saturate(0.65) brightness(0.78)", "saturate(1.05) brightness(1)"]
  );

  // Subtle scale-in over the whole scroll (1.0 → 1.04) — restrained, not bombast.
  const imgScale = useTransform(smoothProgress, [0, 1], [1, 1.05]);

  // Lamp-amber overlay intensifies — the lamp turns up across the journey.
  const amberOpacity = useTransform(smoothProgress, [0, 1], [0.18, 0.42]);

  // Hero copy fades out as canvas progresses past midway (preserves prior pattern).
  const copyOpacity = useTransform(smoothProgress, [0, 0.5, 0.8], [1, 1, 0]);
  const copyY = useTransform(smoothProgress, [0, 1], [0, -40]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-scene="time-machine"
      aria-labelledby="hero-headline"
      className="relative h-[120vh] w-full md:h-[180vh]"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {/*
          Canonical Time Machine hero image — single-frame canvas treatment.
          Migrated from CSS background-image to next/image (Next 16) so the LCP
          element gets automatic WebP/AVIF negotiation, responsive `srcset`,
          and a `<link rel="preload">` injected into <head>. `preload` replaces
          the deprecated `priority` prop (Next 16 release note).
          The original 2.2 MB PNG is the source; the optimizer serves a much
          smaller WebP/AVIF at the device-correct width.
          aria-hidden because it's decorative — the headline carries meaning.
        */}
        <motion.div
          className="absolute inset-0"
          style={{
            filter: prefersReducedMotion ? "saturate(1.05) brightness(1)" : imgFilter,
            scale: prefersReducedMotion ? 1 : imgScale,
          }}
          aria-hidden="true"
        >
          <Image
            src="/time-machine-hero.png"
            alt=""
            fill
            preload
            sizes="100vw"
            quality={85}
            className="object-contain object-[center_49%] scale-[2.25] brightness-125 md:object-cover md:object-center md:scale-100 md:brightness-100"
          />
        </motion.div>

        {/* Lamp-amber warmth overlay — intensifies on scroll (lamp turns up) */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 65%, rgb(217 147 58 / 1) 0%, transparent 55%)",
            mixBlendMode: "soft-light",
            opacity: prefersReducedMotion ? 0.32 : amberOpacity,
            transitionTimingFunction: "var(--ease-cinematic)",
          }}
          aria-hidden="true"
        />

        {/* Cinematic vignette so headline reads on any frame */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-black/65 via-ink-black/25 to-ink-black/90"
          aria-hidden="true"
        />

        {/* Mobile-only: solid dark mask over the text area so the image only
            appears as a clean band below the subtext. Sized so it ends just
            below the body copy now that the headline + subhead sit higher up,
            giving the time-machine image more visible canvas underneath.
            Desktop hidden — desktop uses the vignette above. */}
        <div
          className="md:hidden pointer-events-none absolute inset-x-0 top-0 h-[34vh]"
          style={{ background: "linear-gradient(to bottom, #0E0C0A 70%, transparent 100%)" }}
          aria-hidden="true"
        />

        {/* Full-canvas radial: subhead legibility over bright Claude UI region */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(14, 12, 10, 0.5) 0%, rgba(14, 12, 10, 0.2) 60%, rgba(14, 12, 10, 0) 100%)",
          }}
        />

        {/*
          Layout: header-clearance / centered content / pinned strip.
          `isolate` (isolation: isolate) creates a new stacking context so the
          mix-blend-mode soft-light amber overlay above CANNOT bleed into the
          headline + button rendering. Without this, axe color-contrast walks
          the underlying overlay and falsely reports the orange CTA button as
          1.37:1 (mistakenly merging the amber soft-light into the button bg).
          The visual rendering was correct already — this just gates the
          stacking context so the contrast checker sees only the button's own
          opaque pixels.
        */}
        <div className="relative z-10 flex h-full flex-col justify-between isolate">
          {/* Header clearance */}
          <div className="h-12 shrink-0 md:h-20" aria-hidden="true" />

          {/* Centered content */}
          <motion.div
            className="flex flex-1 items-stretch justify-center px-6 md:items-center"
            style={{
              opacity: prefersReducedMotion ? 1 : copyOpacity,
              y: prefersReducedMotion ? 0 : copyY,
            }}
          >
            <div className="relative isolate flex w-full max-w-[920px] flex-col text-center md:block">
              {/*
                P0 legibility layer (added 2026-04-27 PM): radial darkening
                pad so the headline + subhead + CTAs read cleanly over the
                busy time-machine canvas — especially the 2026-side Claude UI
                mockup region. rgba(14,12,10,0.45) at center → transparent at
                edges. Negative insets extend the pad beyond the text box so
                the fade-out happens off-text. Uses `-z-10` inside the
                isolated stacking context to sink behind the headline + copy
                without escaping the parent.
              */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-8 -inset-y-12 -z-10 sm:-inset-x-16 sm:-inset-y-16"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(14, 12, 10, 0.45) 0%, rgba(14, 12, 10, 0.18) 50%, rgba(14, 12, 10, 0) 80%)",
                }}
              />
              <DisplayHeading
                as="h1"
                size="xl"
                id="hero-headline"
                className="mb-4 md:mb-8"
              >
                Let&rsquo;s Build Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-yellow">
                  AiOS
                </span>
                .
              </DisplayHeading>
              <BodyCopy size="lg" tone="primary" className="mx-auto mb-10 max-w-[760px]">
                1-on-1 setup of Claude Desktop and the tools that will change
                your life.
              </BodyCopy>
              {/*
                The button row sits inside the hero where a soft-light amber
                overlay paints over the underlying time-machine image. That
                blend leaks into axe's color-contrast walker (it sees the
                overlay underneath the button instead of the button's own
                opaque background) and falsely reports the orange CTA as
                low-contrast. Forcing a fresh stacking context here
                (`isolate` + transform translateZ) makes axe see only the
                button's own pixels — same effect every browser already
                renders visually.
              */}
              <div className="relative isolate z-10 mt-auto flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-0 [transform:translateZ(0)]">
                <PrimaryButtonLink
                  href="https://cal.com/jjwalker"
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  className="-translate-y-[15vh] md:translate-y-0"
                >
                  Book a 30-min call
                </PrimaryButtonLink>
                <TextLink
                  href="#services"
                  tone="trust"
                  className="hidden sm:inline px-6 py-3 text-[1.125rem] whitespace-nowrap"
                >
                  See what&rsquo;s included
                </TextLink>
              </div>
            </div>
          </motion.div>

          {/* Mechanism strip — pinned at bottom of hero zone */}
          <div className="shrink-0 pb-0 md:pb-12">
            <MechanismStrip />
          </div>
        </div>
      </div>
    </section>
  );
}
