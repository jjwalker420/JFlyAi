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

const VB_W = 1100;
const VB_H = 1180;

// Tier band Y centers (top→bottom: T1 at top of canvas, T8 at bottom).
const TIER_Y: Record<number, number> = {
  1: 80,
  2: 200,
  3: 320,
  4: 460,
  5: 640,
  6: 780,
  7: 920,
  8: 1080,
};

// Adaptive horizontal spread.
function xPositions(count: number, width = VB_W, margin = 70): number[] {
  if (count <= 0) return [];
  if (count === 1) return [width / 2];
  const usable = width - margin * 2;
  const step = usable / (count - 1);
  return Array.from({ length: count }, (_, i) => margin + step * i);
}

// Card width adapts to label length but caps tighter when many siblings.
function cardWidth(label: string, siblings: number): number {
  const max = siblings >= 10 ? 92 : siblings >= 6 ? 130 : 170;
  const min = siblings >= 10 ? 60 : 70;
  return Math.min(max, Math.max(min, Math.round(label.length * 6.4)));
}

export function TierCanvas({
  activeTier,
  nodesByTier,
  tierNames,
  reducedMotion,
}: Props) {
  // With reduced motion, render fully assembled.
  const effectiveActive = reducedMotion ? 8 : activeTier;

  return (
    <div className="relative h-full w-full">
      <svg
        role="img"
        aria-label="JFly AiOS reference architecture — eight tiers, schematic view"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        {/* Top-of-canvas caption — sits inside the schematic frame */}
        <g aria-hidden="true">
          <text
            x={30}
            y={32}
            fill="rgb(217 147 58 / 0.85)"
            style={{
              font: "500 12px var(--font-mono), ui-monospace, monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Reference architecture · 8 tiers · Live
          </text>
          <line
            x1={30}
            x2={VB_W - 30}
            y1={46}
            y2={46}
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
          const xs = xPositions(nodes.length);
          const tierName = tierNames.find((tn) => tn.n === t)?.name ?? "";
          const y = TIER_Y[t];
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
                fill={
                  state === "planned"
                    ? "rgb(217 147 58 / 0.7)"
                    : state === "current"
                      ? "rgb(216 232 236 / 0.95)"
                      : "rgb(242 235 221 / 0.6)"
                }
                style={{
                  font: "500 12px var(--font-mono), ui-monospace, monospace",
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
                    x2={xs[i]}
                    y2={y - 14}
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
                const x = xs[i];
                const w = cardWidth(n.label, nodes.length);
                return (
                  <NodeCard
                    key={n.id}
                    x={x}
                    y={y}
                    w={w}
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
          __html: `@keyframes tier-pulse { 0% { opacity: 0.55; } 50% { opacity: 1; } 100% { opacity: 0.92; } }`,
        }}
      />
    </div>
  );
}

function NodeCard({
  x,
  y,
  w,
  label,
  state,
  deferred,
  isPulse,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  state: "settled" | "current" | "planned";
  deferred: boolean;
  isPulse: boolean;
}) {
  const h = 28;
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

  // Adaptive font for narrow cards in dense tiers.
  const fontSize = w < 90 ? 9.5 : w < 120 ? 10.5 : 11;

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
        {truncate(label, w < 90 ? 14 : w < 120 ? 18 : 24)}
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
