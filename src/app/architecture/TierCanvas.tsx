"use client";

import type { PublicNode } from "@/data/architecture";

type Props = {
  activeTier: number;          // 1..8 during scroll; 9 = complete (CTA shown)
  nodesByTier: Record<number, PublicNode[]>;
  tierNames: { n: number; name: string }[];
  reducedMotion: boolean;
};

/**
 * TierCanvas — hand-laid SVG schematic of the 8-tier AiOS reference architecture.
 *
 * Coordinates are intentional, not auto-laid: each tier band has a fixed Y, and
 * nodes inside a band space horizontally according to their public-node count
 * (1, 2, 1, 12, 5, 6, 4, 5).
 *
 * Reveal model:
 *   - state "settled":  tier ≤ activeTier-1   solid trust-blue trace, full opacity
 *   - state "current":  tier === activeTier   pulses once, brighter trace
 *   - state "planned":  tier > activeTier     dashed lamp-amber, low opacity
 *
 * Reduced motion: the schematic renders fully assembled (every tier active),
 * no pulse, no draw animation.
 *
 * Sunset stripe earns its place TWICE on the page; once here as a hairline
 * underline beneath the Tier-7 (behavior layer) triad. The second appearance
 * lives in the closing band, not in this component.
 */

const VB_W = 1400;
const VB_H = 1220;

// Tier band Y centers (top→bottom: T1 at top of canvas, T8 at bottom).
// T1 is pushed down to leave breathing room between the top eyebrow caption
// and the T1 row label.
// T4 wraps to two sub-rows (count=12). Its Y is set so row A (anchored at
// TIER_Y[4]) clears the label/underline like a single-row tier, and row B
// (TIER_Y[4] + 52) sits comfortably above T5's label band.
const TIER_Y: Record<number, number> = {
  1: 120,
  2: 240,
  3: 360,
  4: 474,
  5: 680,
  6: 820,
  7: 960,
  8: 1120,
};

// Adaptive horizontal spread.
function xPositions(count: number, width = VB_W, margin = 70): number[] {
  if (count <= 0) return [];
  if (count === 1) return [width / 2];
  const usable = width - margin * 2;
  const step = usable / (count - 1);
  return Array.from({ length: count }, (_, i) => margin + step * i);
}

// --- Auto-fit card sizing -------------------------------------------------
// Cards now grow to fit their label rather than slotting into fixed tiers.
// The mono font lets us estimate text width without DOM measurement:
//   charWidth ≈ fontSize * MONO_CHAR_RATIO
//   cardWidth = max(MIN_W, ceil(label.length * charWidth) + H_PAD)
// Font size is still tied to row density so dense tiers stay readable, but
// labels never render outside their card.
const MONO_CHAR_RATIO = 0.6;   // monospace heuristic
const H_PAD = 18;              // 9px each side
const MIN_W = 80;
const ROW_GAP_MIN = 14;        // min visual gap between cards in same row

function fontSizeFor(siblings: number): number {
  return siblings >= 10 ? 10.5 : siblings >= 6 ? 11.5 : 12;
}

function naturalWidth(label: string, fontSize: number): number {
  const w = Math.ceil(label.length * fontSize * MONO_CHAR_RATIO) + H_PAD;
  return Math.max(MIN_W, w);
}

// Lay out one tier row. Returns per-node {x, y, w, fontSize}. If the natural
// width sum exceeds the canvas, splits into two visual rows (alternating
// indices) so labels never have to be truncated.
//
// Edge-safety: the effective margin grows so the outer card's edge sits at
// least EDGE_PAD inside the viewBox — prevents the leftmost/rightmost card
// from clipping past x=0 or x=VB_W when auto-fit makes them wide.
type Slot = { x: number; y: number; w: number; fontSize: number };
const EDGE_PAD = 8;
function layoutTier(
  count: number,
  labels: string[],
  yCenter: number,
  margin = 70,
): Slot[] {
  if (count === 0) return [];
  const fs = fontSizeFor(count);
  const widths = labels.map((l) => naturalWidth(l, fs));

  // Inset margin so outer card edges sit inside the viewBox by EDGE_PAD.
  // For two-row layouts the outer cards live in row A and row B independently,
  // so we use the max half-width across all cards (safe upper bound).
  const maxHalfW = Math.max(...widths) / 2;
  const safeMargin = Math.max(margin, Math.ceil(maxHalfW + EDGE_PAD));

  // Test fit on a single row at the natural step spacing.
  const usable = VB_W - safeMargin * 2;
  const step = count > 1 ? usable / (count - 1) : usable;
  const fitsSingleRow =
    count === 1 ||
    widths.every((w, i) => {
      const next = widths[i + 1];
      if (next === undefined) return true;
      return (w + next) / 2 + ROW_GAP_MIN <= step;
    });

  if (fitsSingleRow) {
    const xs = xPositions(count, VB_W, safeMargin);
    return widths.map((w, i) => ({
      x: xs[i],
      y: yCenter,
      w,
      fontSize: fs,
    }));
  }

  // Two-row wrap: alternate indices into row A (even) / row B (odd).
  // Anchor row A AT yCenter (keeps label/underline geometry working like a
  // single-row tier) and stack row B below. The tier's nominal Y is set
  // accordingly in TIER_Y so the row pair clears the next tier band.
  const rowAIdx = labels.map((_, i) => i).filter((i) => i % 2 === 0);
  const rowBIdx = labels.map((_, i) => i).filter((i) => i % 2 === 1);
  const xsA = xPositions(rowAIdx.length, VB_W, safeMargin);
  const xsB = xPositions(rowBIdx.length, VB_W, safeMargin);
  const yA = yCenter;
  const yB = yCenter + 52;
  const slots: Slot[] = new Array(count);
  rowAIdx.forEach((idx, k) => {
    slots[idx] = { x: xsA[k], y: yA, w: widths[idx], fontSize: fs };
  });
  rowBIdx.forEach((idx, k) => {
    slots[idx] = { x: xsB[k], y: yB, w: widths[idx], fontSize: fs };
  });
  return slots;
}

export function TierCanvas({
  activeTier,
  nodesByTier,
  tierNames,
  reducedMotion,
}: Props) {
  // With reduced motion, render fully assembled.
  const effectiveActive = reducedMotion ? 8 : activeTier;

  // Canvas-complete pulse fires once when the schematic finishes (activeTier
  // reaches the CTA state, i.e. > 8). Reduced motion: no pulse.
  const isComplete = !reducedMotion && activeTier >= 9;

  return (
    <div className="relative h-full w-full">
      <svg
        role="img"
        aria-label="JFly AiOS reference architecture — eight tiers, schematic view"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        style={{
          animation: isComplete
            ? "canvas-complete-pulse 1100ms var(--ease-deliberate) 1"
            : undefined,
        }}
      >
        {/* Top-of-canvas caption — sits inside the schematic frame */}
        <g aria-hidden="true">
          <text
            x={30}
            y={28}
            fill="rgb(255 255 255)"
            style={{
              font: "700 12px var(--font-mono), ui-monospace, monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Reference architecture · 8 tiers · Live
          </text>
          <line
            x1={30}
            x2={VB_W - 30}
            y1={42}
            y2={42}
            stroke="rgb(242 235 221 / 0.10)"
            strokeWidth={1}
          />
        </g>

        {/* Inter-tier center spine — drawn first so cards sit on top */}
        <g aria-hidden="true">
          {[1, 2, 3, 4, 5, 6, 7].map((t) => {
            const fromY = TIER_Y[t] + 32;
            const toY = TIER_Y[t + 1] - 32;
            const traceActive = effectiveActive >= t + 1;
            return (
              <line
                key={`spine-${t}`}
                x1={VB_W / 2}
                x2={VB_W / 2}
                y1={fromY}
                y2={toY}
                stroke={
                  traceActive
                    ? "rgb(46 111 164 / 0.7)"
                    : "rgb(217 147 58 / 0.32)"
                }
                strokeWidth={1}
                strokeDasharray={traceActive ? "0" : "4 6"}
                style={{
                  transition: reducedMotion
                    ? "none"
                    : "stroke 700ms var(--ease-deliberate)",
                }}
              />
            );
          })}
        </g>

        {/* Tier bands */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((t) => {
          const nodes = nodesByTier[t] ?? [];
          const tierName = tierNames.find((tn) => tn.n === t)?.name ?? "";
          const y = TIER_Y[t];
          const slots = layoutTier(
            nodes.length,
            nodes.map((n) => n.label),
            y,
          );
          const state =
            effectiveActive > t
              ? "settled"
              : effectiveActive === t
                ? "current"
                : "planned";

          return (
            <g
              key={`tier-${t}`}
              opacity={state === "planned" ? 0.32 : 1}
              style={{
                transition: reducedMotion
                  ? "none"
                  : "opacity 600ms var(--ease-deliberate)",
              }}
            >
              {/* Tier label */}
              <text
                x={30}
                y={y - 38}
                fill="rgb(255 255 255)"
                style={{
                  font: "700 12px var(--font-mono), ui-monospace, monospace",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                T{t} · {tierName}
              </text>

              {/* Tier underline rule */}
              <line
                x1={30}
                x2={VB_W - 30}
                y1={y - 24}
                y2={y - 24}
                stroke={
                  state === "planned"
                    ? "rgb(217 147 58 / 0.18)"
                    : "rgb(242 235 221 / 0.10)"
                }
                strokeWidth={1}
              />

              {/* Hairline fan-out traces from tier-center spine to each node */}
              {state !== "planned" &&
                nodes.length > 1 &&
                nodes.map((n, i) => (
                  <line
                    key={`fan-${n.id}`}
                    x1={VB_W / 2}
                    y1={y - 24}
                    x2={slots[i].x}
                    y2={slots[i].y - 14}
                    stroke="rgb(46 111 164 / 0.45)"
                    strokeWidth={1}
                    style={{
                      transition: reducedMotion
                        ? "none"
                        : "stroke 600ms var(--ease-deliberate)",
                    }}
                  />
                ))}

              {/* Sunset stripe earns its place under Tier 7 (behavior layer) */}
              {t === 7 && state !== "planned" && (
                <SunsetStripe y={y + 60} cx={VB_W / 2} width={260} />
              )}

              {/* Node cards */}
              {nodes.map((n, i) => {
                const slot = slots[i];
                return (
                  <NodeCard
                    key={n.id}
                    x={slot.x}
                    y={slot.y}
                    w={slot.w}
                    fontSize={slot.fontSize}
                    label={n.label}
                    state={state}
                    deferred={n.status === "deferred"}
                    isPulse={!reducedMotion && state === "current"}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Pulse keyframes — local stylesheet, scoped to this component's class. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes tier-pulse { 0% { opacity: 0.55; } 50% { opacity: 1; } 100% { opacity: 0.92; } }
            @keyframes canvas-complete-pulse {
              0%   { filter: brightness(1) drop-shadow(0 0 0 rgba(46,111,164,0)); }
              50%  { filter: brightness(1.18) drop-shadow(0 0 18px rgba(46,111,164,0.45)); }
              100% { filter: brightness(1) drop-shadow(0 0 0 rgba(46,111,164,0)); }
            }
          `,
        }}
      />
    </div>
  );
}

function NodeCard({
  x,
  y,
  w,
  fontSize,
  label,
  state,
  deferred,
  isPulse,
}: {
  x: number;
  y: number;
  w: number;
  fontSize: number;
  label: string;
  state: "settled" | "current" | "planned";
  deferred: boolean;
  isPulse: boolean;
}) {
  const h = 34;
  const fillSettled = "rgb(20 52 82 / 0.4)";
  const fillCurrent = "rgb(46 111 164 / 0.55)";
  const fillPlanned = "rgb(217 147 58 / 0.08)";
  const strokeSettled = "rgb(46 111 164 / 0.7)";
  const strokeCurrent = "rgb(216 232 236 / 0.85)";
  const strokePlanned = "rgb(217 147 58 / 0.55)";

  const fill =
    state === "settled" ? fillSettled : state === "current" ? fillCurrent : fillPlanned;
  const stroke =
    state === "settled"
      ? strokeSettled
      : state === "current"
        ? strokeCurrent
        : strokePlanned;
  const strokeDash =
    deferred && state !== "planned"
      ? "3 4"
      : state === "planned"
        ? "4 6"
        : "0";

  // Hard ceiling safety net only — auto-fit width should already contain the
  // label. Triggers only for absurdly long strings.
  const safeMax = 64;

  return (
    <g
      transform={`translate(${x - w / 2} ${y - h / 2})`}
      style={{
        animation: isPulse
          ? "tier-pulse 900ms var(--ease-deliberate) 1"
          : undefined,
      }}
    >
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={6}
        ry={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
        strokeDasharray={strokeDash}
      />
      <text
        x={w / 2}
        y={h / 2 + 4}
        textAnchor="middle"
        fill={
          state === "planned"
            ? "rgb(217 147 58 / 0.75)"
            : "rgb(242 235 221 / 0.95)"
        }
        style={{
          font: `500 ${fontSize}px var(--font-mono), ui-monospace, monospace`,
        }}
      >
        {truncate(label, safeMax)}
      </text>
    </g>
  );
}

function SunsetStripe({ y, cx, width }: { y: number; cx: number; width: number }) {
  const x1 = cx - width / 2;
  const id = "sunset-stripe-grad";
  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C5443B" />
          <stop offset="33%" stopColor="#E07B3F" />
          <stop offset="66%" stopColor="#E6B547" />
          <stop offset="100%" stopColor="#C9893E" />
        </linearGradient>
      </defs>
      <rect x={x1} y={y} width={width} height={2} rx={1} fill={`url(#${id})`} />
    </g>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}
