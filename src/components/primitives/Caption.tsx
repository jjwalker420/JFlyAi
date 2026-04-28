import type { ReactNode } from "react";

type Tone = "amber" | "trust" | "signature" | "phosphor" | "muted";

const TONE: Record<Tone, string> = {
  amber: "text-lamp-amber",
  // Captions are 12.8px small text — WCAG AA needs 4.5:1 contrast on
  // ink-black ground. The primary trust-blue (#1D4D7A) only clears 2.22:1,
  // and even trust-blue-tint (#2E6FA4) only clears 3.65:1. We use an
  // arbitrary brighter blue (#7DB1E0, ~8.6:1) that reads as the same
  // brand-blue family at small size while satisfying small-text AA. Used
  // exclusively at Caption-size — DisplayHeading (large text) keeps
  // trust-blue-tint as its "trust" tone.
  trust: "text-[#7DB1E0]",
  signature:
    "bg-clip-text text-transparent bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-yellow",
  phosphor: "text-crt-phosphor-green",
  muted: "text-bone/70",
};

type Props = {
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

export function Caption({ tone = "muted", children, className = "" }: Props) {
  return (
    <p
      data-era={tone === "phosphor" ? "1985" : undefined}
      className={`font-body text-[0.8rem] font-medium uppercase tracking-[0.05em] ${TONE[tone]} ${className}`}
    >
      {children}
    </p>
  );
}
