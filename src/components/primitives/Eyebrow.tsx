import type { ReactNode } from "react";

type Tone = "amber" | "trust" | "signature" | "phosphor" | "muted";

const TONE: Record<Tone, string> = {
  amber: "text-lamp-amber",
  // Eyebrows are 12.8px small text — same WCAG AA rationale as Caption.tsx:
  // trust-blue fails small-text 4.5:1 on ink-black. The brighter blue
  // #7DB1E0 (~8.6:1) reads as the same brand-blue family while clearing AA.
  trust: "text-[#7DB1E0]",
  signature:
    "bg-clip-text text-transparent bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-yellow",
  phosphor: "text-crt-phosphor-green",
  muted: "text-bone/70",
};

type Props = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

export function Eyebrow({ children, tone = "amber", className = "" }: Props) {
  return (
    <p
      data-era={tone === "phosphor" ? "1985" : undefined}
      className={`font-body font-medium text-[0.8rem] uppercase tracking-[0.2em] ${TONE[tone]} ${className}`}
    >
      {children}
    </p>
  );
}
