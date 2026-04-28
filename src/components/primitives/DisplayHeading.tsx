import type { ReactNode, ElementType } from "react";

type Size = "xl" | "lg" | "md";
type Tone = "primary" | "amber" | "trust" | "signature" | "phosphor";

const SIZE: Record<Size, string> = {
  // clamp(min, vw, max) — readable at small viewports without losing the cinematic register at desktop
  xl: "text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] tracking-tight font-bold",
  lg: "text-[clamp(2rem,5vw,3.052rem)] leading-[1.10] tracking-tight font-bold",
  md: "text-[clamp(1.75rem,3vw,2.441rem)] leading-tight tracking-tight font-semibold",
};

const TONE: Record<Tone, string> = {
  primary: "text-bone",
  amber: "text-lamp-amber",
  // trust-blue-tint (#2E6FA4) instead of trust-blue (#1D4D7A): the primary
  // brand blue fails WCAG 3:1 on ink-black ground (2.22 ratio). The tint
  // variant lives in the design tokens for exactly this reason — "lighter
  // variant for highlights" per globals.css. Tint reads as the same brand
  // family at distance and clears 3.65:1 on ink-black (large text AA).
  trust: "text-trust-blue-tint",
  signature:
    "bg-clip-text text-transparent bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-yellow",
  phosphor: "text-crt-phosphor-green",
};

type Props = {
  as?: ElementType;
  size?: Size;
  tone?: Tone;
  id?: string;
  children: ReactNode;
  className?: string;
};

export function DisplayHeading({
  as: Tag = "h2",
  size = "lg",
  tone = "primary",
  id,
  children,
  className = "",
}: Props) {
  return (
    <Tag
      id={id}
      data-era={tone === "phosphor" ? "1985" : undefined}
      className={`font-display ${SIZE[size]} ${TONE[tone]} ${className}`}
    >
      {children}
    </Tag>
  );
}
