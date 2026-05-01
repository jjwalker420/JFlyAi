/**
 * ArchitectureDiagram — sanitized 5-column tier diagram for the public page.
 *
 * Server-rendered. Reads from getPublicArchitecture() (already filtered to
 * visibility: "both" with public copy substituted). Visual structure mirrors
 * the internal Artifacts/claude-md-structure.html:
 *   - 5 columns (User Config / Home / Project / Behavior / External Memory)
 *   - Tier headers per column
 *   - Live (solid trust-blue) and Deferred (dashed lamp-amber) node states
 *   - JFly.Ai parent-child nesting
 *   - Auto-load + on-trigger rules listed below
 *
 * Loading arrows are decorative (left to the internal version) — the public
 * page describes loading rules in the rules block instead.
 *
 * AiOS spelling: lowercase i (CLAUDE.md hard rule #1) — preserved in the
 * tier-name copy via the JSON source.
 */
import type { ReactNode } from "react";

type Arch = ReturnType<
  typeof import("@/data/architecture")["getPublicArchitecture"]
>;

const COLOR_TRUST = "var(--color-trust-blue)";
const COLOR_TRUST_TINT = "var(--color-trust-blue-tint)";
const COLOR_TRUST_DEEP = "var(--color-trust-blue-deep)";
const COLOR_AMBER = "var(--color-lamp-amber)";

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
  const isDeferred = status === "deferred";
  return (
    <div
      className="rounded-[7px] border-2 px-3 py-2.5 transition-colors"
      style={{
        borderColor: isDeferred ? COLOR_AMBER : COLOR_TRUST,
        borderStyle: isDeferred ? "dashed" : "solid",
        background: isDeferred ? "transparent" : "rgba(29,77,122,0.06)",
      }}
    >
      <div
        className="font-mono text-[12px] font-semibold leading-snug break-words"
        style={{ color: isDeferred ? COLOR_AMBER : "var(--color-bone)" }}
      >
        {label}
      </div>
      {description && (
        <div className="mt-1 font-mono text-[10.5px] leading-[1.4] text-bone/60">
          {description}
        </div>
      )}
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        <span
          className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
          style={{
            background: isDeferred ? "#6E4818" : COLOR_TRUST_DEEP,
            color: isDeferred ? COLOR_AMBER : COLOR_TRUST_TINT,
          }}
        >
          {isDeferred ? "Deferred" : "Live"}
        </span>
        {badges.map((b) => {
          const isTrigger = /trigger/i.test(b);
          return (
            <span
              key={b}
              className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
              style={
                isTrigger
                  ? { background: "rgba(168,160,154,0.12)", color: "var(--color-mid-gray)" }
                  : { background: "rgba(46,111,164,0.18)", color: COLOR_TRUST_TINT }
              }
            >
              {b}
            </span>
          );
        })}
      </div>
      {children && (
        <div
          className="ml-3 mt-2 flex flex-col gap-1.5 border-l border-dashed pl-3"
          style={{ borderColor: "#2A2620" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function ArchitectureDiagram({ arch }: { arch: Arch }) {
  const tierName = (n: number) =>
    arch.tiers.find((t) => t.n === n)?.name ?? `Tier ${n}`;
  const colLabel = (n: number) =>
    arch.columns.find((c) => c.n === n)?.label ?? "";

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
        <div className="mb-8 flex flex-wrap gap-7 border-b border-bone/10 pb-4 font-mono text-[11px] text-bone/60">
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
              style={{ borderColor: COLOR_AMBER }}
            />
            Deferred (planned, not yet built)
          </div>
        </div>

        {/* 5-column grid; collapses to 2-col on smaller screens (matches internal HTML) */}
        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          {/* Sunset divider between operational (cols 1-4) and external memory (col 5),
              visible at xl breakpoint where 5-col layout activates. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 hidden xl:block"
            style={{
              left: "calc(80% - 1px)",
              width: "2px",
              background:
                "linear-gradient(180deg, var(--color-sunset-red), var(--color-sunset-orange), var(--color-sunset-yellow))",
              opacity: 0.55,
              borderRadius: "1px",
            }}
          />

          {[1, 2, 3, 4, 5].map((c) => {
            const colNodes = arch.nodes.filter((n) => n.column === c);
            const tiersInCol = Array.from(
              new Set(colNodes.map((n) => n.tier))
            ).sort((a, b) => a - b);

            const inner = (
              <div className="flex flex-col gap-2">
                <div
                  className="mb-2 border-b pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/40"
                  style={{ borderColor: "#2A2620" }}
                >
                  {colLabel(c)}
                </div>
                {tiersInCol.map((tn) => (
                  <div key={tn}>
                    <div
                      className="mt-3 mb-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] first:mt-0"
                      style={{ color: COLOR_TRUST_TINT }}
                    >
                      Tier {tn} · {tierName(tn)}
                    </div>
                    <div className="flex flex-col gap-2">
                      {colNodes
                        .filter((n) => n.tier === tn)
                        .map((n) => (
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
                ))}
              </div>
            );

            // External-memory column gets the monitor-glow tint wrapper
            return c === 5 ? (
              <div
                key={c}
                className="rounded-[10px] p-3.5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(216,232,236,0.04) 0%, rgba(216,232,236,0.01) 100%)",
                }}
              >
                {inner}
              </div>
            ) : (
              <div key={c}>{inner}</div>
            );
          })}
        </div>

        {/* Loading rules */}
        <div className="mt-12 grid grid-cols-1 gap-8 border-t border-bone/10 pt-8 md:grid-cols-2">
          <div>
            <h3
              className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: COLOR_TRUST_TINT }}
            >
              Auto-load (every session)
            </h3>
            <ul className="flex flex-col gap-2">
              {arch.rules.autoLoad.map((html, i) => (
                <li
                  key={i}
                  className="relative pl-4 font-mono text-[11.5px] leading-[1.5] text-bone/60"
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
              className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: COLOR_TRUST_TINT }}
            >
              On-trigger (conditional reads)
            </h3>
            <ul className="flex flex-col gap-2">
              {arch.rules.onTrigger.map((html, i) => (
                <li
                  key={i}
                  className="relative pl-4 font-mono text-[11.5px] leading-[1.5] text-bone/60"
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
