/**
 * ArchitectureDiagram — sanitized tier diagram for the public page.
 *
 * Server-rendered. Reads from getPublicArchitecture(). Tightenings (pass 2):
 *  - Tier-major layout: each tier is a row with id="tier-N" anchor (for
 *    TierNavigator scroll targets). Column headers stay sticky-ish at top.
 *  - 220px min card width; grid wraps to 2-col / 1-col when squeezed.
 *  - word-break:normal + hyphens:auto + overflow-wrap:break-word on titles
 *    (kills "Consultin g practice" mid-word break).
 *  - Stronger header hierarchy: column labels 18px / 700 / trust-blue-tint
 *    with sunset-stripe accent under each. Tier sub-labels 13px / 600 / bone.
 *    Card titles 15px / 600 (cards already loud — supporting role now).
 *  - Equal-height cards within a tier row via `align-items:stretch` +
 *    `grid-auto-rows:1fr` on the row's grid.
 *  - "deferred" status renders as PLANNED (public copy). Internal HTML keeps
 *    DEFERRED. Same dashed-amber treatment.
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

// Status → public-facing badge text. Public uses PLANNED; internal HTML
// (Artifacts/claude-md-structure.html) is unchanged and still says DEFERRED.
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
        minWidth: 0, // allow grid track to shrink without overflow
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
    <div className="mb-1">
      <div
        className="font-mono uppercase"
        style={{
          fontSize: "16px",
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

  // Distinct tiers present (ascending) and columns 1..5
  const allTiers = Array.from(new Set(arch.nodes.map((n) => n.tier))).sort(
    (a, b) => a - b
  );
  const columns = [1, 2, 3, 4, 5];

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
        <div className="mb-8 flex flex-wrap gap-7 border-b border-bone/10 pb-4 font-mono text-[11px] text-bone/70">
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

        {/* Column headers row — stays at top of the grid as a horizontal banner */}
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {columns.map((c) => {
            const colLabel =
              arch.columns.find((x) => x.n === c)?.label ?? "";
            return (
              <div key={`hdr-${c}`}>
                <ColumnHeader label={colLabel} />
              </div>
            );
          })}
        </div>

        {/* Tier rows — each row gets id="tier-N" anchor for TierNavigator */}
        <div className="mt-6 flex flex-col gap-12">
          {allTiers.map((tn) => {
            const tierNodes = arch.nodes.filter((n) => n.tier === tn);
            return (
              <div
                key={tn}
                id={`tier-${tn}`}
                className="scroll-mt-24"
                style={{ scrollMarginTop: "96px" }}
              >
                <div
                  className="mb-4 font-mono uppercase"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "var(--color-bone)",
                  }}
                >
                  Tier {tn} · {tierName(tn)}
                </div>

                <div
                  className="grid gap-5"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gridAutoRows: "1fr",
                    alignItems: "stretch",
                  }}
                >
                  {columns.map((c) => {
                    const cellNodes = tierNodes.filter((n) => n.column === c);
                    return (
                      <div
                        key={`${tn}-${c}`}
                        className="flex flex-col gap-2"
                        style={{ minWidth: 0 }}
                      >
                        {cellNodes.length === 0 ? (
                          // empty cell — keeps the column rhythm
                          <div aria-hidden="true" className="h-full" />
                        ) : (
                          cellNodes.map((n) => (
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
                          ))
                        )}
                      </div>
                    );
                  })}
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
