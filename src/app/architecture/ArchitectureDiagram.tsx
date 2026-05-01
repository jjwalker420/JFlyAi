/**
 * ArchitectureDiagram — sanitized tier diagram for the public page.
 *
 * Server-rendered. Reads from getPublicArchitecture(). v4 layout:
 *  - STICKY column header bar at top of diagram. Pins the 5 column titles
 *    (USER CONFIG, HOME CONTEXT, PROJECT LAYER, BEHAVIOR LAYER, EXTERNAL
 *    MEMORY) as the user scrolls — like freezing row 1 in Excel. Backdrop
 *    blur + semi-opaque ink-black so cards don't bleed through.
 *  - Tier BANDS: each tier is a horizontal section spanning all 5 columns,
 *    with the tier label as a left-aligned chapter heading. Inside each
 *    band, cards lay out column-by-column on a 5-track grid. Empty cells
 *    collapse (NodeBlock not rendered) so band height = max card height
 *    in that tier. Sparse tiers stay short, dense tiers grow taller.
 *  - "Push up" effect: cards in shorter columns sit directly under the
 *    next tier band — no empty whitespace under columns that don't span
 *    every tier.
 *  - Tier band gets id="tier-N" anchor for TierNavigator scroll targets.
 *    scroll-margin-top accounts for sticky header bar height.
 *
 * Preserved from v3: card visual styling (LIVE solid trust-blue / PLANNED
 * dashed lamp-amber), sunset-stripe accents, word-break fixes, equal card
 * heights within a tier band, PLANNED rename, status/badge tokens.
 *
 * AiOS spelling: lowercase i (CLAUDE.md hard rule #1) — preserved via JSON.
 */
import type { ReactNode } from "react";

type Arch = ReturnType<
  typeof import("@/data/architecture")["getPublicArchitecture"]
>;

const COLOR_TRUST = "var(--color-trust-blue)";
const COLOR_TRUST_TINT = "var(--color-trust-blue-tint)";
const COLOR_TRUST_DEEP = "var(--color-trust-blue-deep)";
// Public renderer treats "deferred" status as PLANNED; same amber visual.
const COLOR_PLANNED = "var(--color-lamp-amber)";

// Sticky header bar height — used for scroll-margin offset on tier anchors.
const STICKY_OFFSET_PX = 112;

const STATUS_LABEL: Record<"live" | "deferred", string> = {
  live: "Live",
  deferred: "Planned",
};

const cardTitleStyle: React.CSSProperties = {
  wordBreak: "normal",
  overflowWrap: "break-word",
  hyphens: "auto",
};

function NodeBlock({
  label,
  description,
  status,
  badges = [],
  children,
}: {
  label: string;
  description: string;
  status: "live" | "deferred";
  badges?: string[];
  children?: ReactNode;
}) {
  const isPlanned = status === "deferred";
  return (
    <div
      className="flex h-full flex-col rounded-[7px] border-2 px-3.5 py-3 transition-colors"
      style={{
        borderColor: isPlanned ? COLOR_PLANNED : COLOR_TRUST,
        borderStyle: isPlanned ? "dashed" : "solid",
        background: isPlanned ? "transparent" : "rgba(29,77,122,0.06)",
        minWidth: 0,
      }}
    >
      <div
        className="font-mono text-[15px] font-semibold leading-snug"
        style={{
          color: isPlanned ? COLOR_PLANNED : "var(--color-bone)",
          ...cardTitleStyle,
        }}
      >
        {label}
      </div>
      {description && (
        <div
          className="mt-1.5 font-mono text-[11.5px] leading-[1.45] text-bone/65"
          style={cardTitleStyle}
        >
          {description}
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span
          className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
          style={{
            background: isPlanned ? "#6E4818" : COLOR_TRUST_DEEP,
            color: isPlanned ? COLOR_PLANNED : COLOR_TRUST_TINT,
          }}
        >
          {STATUS_LABEL[status]}
        </span>
        {badges.map((b) => {
          const isTrigger = /trigger/i.test(b);
          return (
            <span
              key={b}
              className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
              style={
                isTrigger
                  ? {
                      background: "rgba(168,160,154,0.12)",
                      color: "var(--color-mid-gray)",
                    }
                  : {
                      background: "rgba(46,111,164,0.18)",
                      color: COLOR_TRUST_TINT,
                    }
              }
            >
              {b}
            </span>
          );
        })}
      </div>
      {children && (
        <div
          className="ml-3 mt-2.5 flex flex-1 flex-col gap-1.5 border-l border-dashed pl-3"
          style={{ borderColor: "#2A2620" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function ColumnHeader({ label }: { label: string }) {
  return (
    <div className="flex flex-col">
      <div
        className="font-mono uppercase"
        style={{
          fontSize: "14px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: COLOR_TRUST_TINT,
          lineHeight: 1.25,
        }}
      >
        {label}
      </div>
      <div
        aria-hidden="true"
        className="mt-1.5 h-[3px] w-12 rounded-full opacity-80"
        style={{
          background:
            "linear-gradient(90deg, var(--color-sunset-red), var(--color-sunset-orange), var(--color-sunset-yellow))",
        }}
      />
    </div>
  );
}

export function ArchitectureDiagram({ arch }: { arch: Arch }) {
  const tierName = (n: number) =>
    arch.tiers.find((t) => t.n === n)?.name ?? `Tier ${n}`;

  const allTiers = Array.from(new Set(arch.nodes.map((n) => n.tier))).sort(
    (a, b) => a - b
  );
  const columns = [1, 2, 3, 4, 5];

  // Shared grid template: 5 equal tracks on >=lg, collapses to 2/1 below.
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: "20px",
  };

  return (
    <section
      id="architecture-diagram"
      aria-labelledby="arch-diagram-heading"
      className="relative px-6 py-8 md:py-12"
    >
      <h2 id="arch-diagram-heading" className="sr-only">
        AiOS architecture diagram
      </h2>

      <div className="mx-auto max-w-[1280px]">
        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-7 border-b border-bone/10 pb-4 font-mono text-[11px] text-bone/70">
          <div className="flex items-center gap-2">
            <span
              className="block h-3 w-5 rounded-[3px] border-2"
              style={{
                borderColor: COLOR_TRUST,
                background: "rgba(29,77,122,0.12)",
              }}
            />
            Live (built and active)
          </div>
          <div className="flex items-center gap-2">
            <span
              className="block h-3 w-5 rounded-[3px] border-2 border-dashed"
              style={{ borderColor: COLOR_PLANNED }}
            />
            Planned (on the roadmap)
          </div>
        </div>

        {/* STICKY column header bar — pins to top of viewport on scroll.
            z-30 clears PCBTexture (z-1) and content (z-2). Backdrop blur
            + semi-opaque ink-black keeps cards readable underneath. */}
        <div
          className="sticky top-0 z-30 -mx-2 hidden md:block"
          style={{
            backgroundColor: "rgba(14, 12, 10, 0.88)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderBottom: "1px solid rgba(46,111,164,0.35)",
            paddingTop: "12px",
            paddingBottom: "12px",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
        >
          <div style={gridStyle}>
            {columns.map((c) => {
              const colLabel =
                arch.columns.find((x) => x.n === c)?.label ?? "";
              return (
                <div key={`hdr-${c}`} style={{ minWidth: 0 }}>
                  <ColumnHeader label={colLabel} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile-only column legend (sticky bar hidden <md). Reminds the
            reader what the 5 columns are when they stack vertically. */}
        <div className="mb-6 mt-2 block md:hidden">
          <div className="font-mono text-[11px] uppercase tracking-wider text-bone/60">
            5 columns: User Config · Home Context · Project Layer · Behavior
            Layer · External Memory
          </div>
        </div>

        {/* Tier bands — column-major flow inside each band. Empty cells
            collapse (NodeBlock not rendered) so band height = max card
            height in that tier. */}
        <div className="mt-6 flex flex-col gap-10">
          {allTiers.map((tn) => {
            const tierNodes = arch.nodes.filter((n) => n.tier === tn);
            return (
              <div
                key={tn}
                id={`tier-${tn}`}
                style={{ scrollMarginTop: `${STICKY_OFFSET_PX + 16}px` }}
              >
                {/* Tier band header — left-aligned chapter divider */}
                <div className="mb-3 flex items-baseline gap-3">
                  <div
                    className="font-mono uppercase"
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      color: COLOR_TRUST_TINT,
                    }}
                  >
                    Tier {tn}
                  </div>
                  <div
                    className="font-mono uppercase"
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "var(--color-bone)",
                    }}
                  >
                    {tierName(tn)}
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-px flex-1"
                    style={{ background: "rgba(46,111,164,0.22)" }}
                  />
                </div>

                {/* Cards: 5-track grid on md+, stacks on mobile */}
                <div
                  className="grid gap-5 md:gap-5"
                  style={{
                    gridTemplateColumns: "1fr",
                  }}
                >
                  <div
                    className="hidden md:grid"
                    style={{
                      ...gridStyle,
                      gridAutoRows: "1fr",
                      alignItems: "stretch",
                    }}
                  >
                    {columns.map((c) => {
                      const cellNodes = tierNodes.filter((n) => n.column === c);
                      if (cellNodes.length === 0) {
                        // Empty cell renders nothing — collapses height
                        // contribution but preserves grid track alignment.
                        return <div key={`${tn}-${c}`} aria-hidden="true" />;
                      }
                      return (
                        <div
                          key={`${tn}-${c}`}
                          className="flex flex-col gap-2"
                          style={{ minWidth: 0 }}
                        >
                          {cellNodes.map((n) => (
                            <NodeBlock
                              key={n.id}
                              label={n.label}
                              description={n.description}
                              status={n.status}
                              badges={n.badges}
                            >
                              {n.children?.map((child) => (
                                <NodeBlock
                                  key={child.id}
                                  label={child.label}
                                  description={child.description}
                                  status={child.status}
                                />
                              ))}
                            </NodeBlock>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile: single column, all tier cards stacked */}
                  <div className="flex flex-col gap-3 md:hidden">
                    {tierNodes.map((n) => (
                      <NodeBlock
                        key={n.id}
                        label={n.label}
                        description={n.description}
                        status={n.status}
                        badges={n.badges}
                      >
                        {n.children?.map((child) => (
                          <NodeBlock
                            key={child.id}
                            label={child.label}
                            description={child.description}
                            status={child.status}
                          />
                        ))}
                      </NodeBlock>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading rules */}
        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-bone/10 pt-8 md:grid-cols-2">
          <div>
            <h3
              className="mb-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: COLOR_TRUST_TINT }}
            >
              Auto-load (every session)
            </h3>
            <ul className="flex flex-col gap-2">
              {arch.rules.autoLoad.map((html, i) => (
                <li
                  key={i}
                  className="relative pl-4 font-mono text-[11.5px] leading-[1.5] text-bone/70"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0"
                    style={{ color: COLOR_TRUST_TINT }}
                  >
                    →
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: html }} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3
              className="mb-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: COLOR_TRUST_TINT }}
            >
              On-trigger (conditional reads)
            </h3>
            <ul className="flex flex-col gap-2">
              {arch.rules.onTrigger.map((html, i) => (
                <li
                  key={i}
                  className="relative pl-4 font-mono text-[11.5px] leading-[1.5] text-bone/70"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 text-bone/40"
                  >
                    ↝
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: html }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
