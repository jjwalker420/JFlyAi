"use client";

/**
 * TierNavigator — sticky left-edge tier jumper, desktop-only (>=1024px).
 *
 * IntersectionObserver tracks #tier-N anchors in the diagram. Active tier
 * highlights sunset-orange; inactive uses trust-blue-tint. Smooth-scroll on
 * click. Hidden on mobile via `hidden lg:block`.
 */
import { useEffect, useState } from "react";

type Tier = { n: number; name: string };

export function TierNavigator({ tiers }: { tiers: Tier[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const els = tiers
      .map((t) => document.getElementById(`tier-${t.n}`))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry highest on screen that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const id = visible[0].target.id;
          const n = Number(id.replace("tier-", ""));
          if (!Number.isNaN(n)) setActive(n);
        }
      },
      {
        // Top margin pushed down to account for sticky header bar — a tier
        // is "active" once it's clear of the frozen column titles.
        rootMargin: "-140px 0px -60% 0px",
        threshold: 0,
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [tiers]);

  const handleClick = (n: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(`tier-${n}`);
    if (!el) return;
    // Offset accounts for sticky column header bar (~112px) + breathing room.
    const top = el.getBoundingClientRect().top + window.scrollY - 132;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Architecture tiers"
      className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
      style={{ width: "96px" }}
    >
      <ul className="flex flex-col gap-1.5">
        {tiers.map((t) => {
          const isActive = active === t.n;
          // Take first 2 words, truncate to fit
          const short = t.name.split(/\s+/).slice(0, 2).join(" ");
          return (
            <li key={t.n}>
              <a
                href={`#tier-${t.n}`}
                onClick={handleClick(t.n)}
                className="block rounded-md border px-2 py-1.5 font-mono text-[10px] leading-tight uppercase tracking-wider transition-colors"
                style={{
                  borderColor: isActive
                    ? "var(--color-sunset-orange)"
                    : "rgba(46,111,164,0.35)",
                  background: isActive
                    ? "rgba(224,123,63,0.12)"
                    : "rgba(29,77,122,0.05)",
                  color: isActive
                    ? "var(--color-sunset-orange)"
                    : "var(--color-trust-blue-tint)",
                }}
              >
                <div className="font-semibold">T{t.n}</div>
                <div className="mt-0.5 text-[9px] opacity-80">{short}</div>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
