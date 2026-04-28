import type { ReactNode } from "react";

type Size = "lg" | "base";
type Tone = "primary" | "muted";

const SIZE: Record<Size, string> = {
  lg: "text-[1.25rem] leading-[1.45]",
  base: "text-base leading-[1.55]",
};

const TONE: Record<Tone, string> = {
  primary: "text-rocket-white",
  muted: "text-rocket-white/70",
};

type Props = {
  size?: Size;
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

export function BodyCopy({
  size = "lg",
  tone = "muted",
  children,
  className = "",
}: Props) {
  return (
    <p className={`font-body ${SIZE[size]} ${TONE[tone]} ${className}`}>
      {children}
    </p>
  );
}
