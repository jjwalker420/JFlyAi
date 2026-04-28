import type { ReactNode } from "react";
import Link from "next/link";

type Tone = "amber" | "trust" | "signature" | "phosphor" | "muted";

const TONE: Record<Tone, string> = {
  amber: "text-lamp-amber hover:underline",
  trust: "text-trust-blue hover:underline",
  signature:
    "bg-clip-text text-transparent bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-yellow hover:underline",
  phosphor: "text-crt-phosphor-green hover:underline",
  muted: "text-bone/70 hover:text-trust-blue",
};

type Props = {
  href: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

export function TextLink({ href, tone = "trust", children, className = "" }: Props) {
  return (
    <Link
      href={href}
      data-era={tone === "phosphor" ? "1985" : undefined}
      className={`underline-offset-4 transition-colors duration-200 ${TONE[tone]} ${className}`}
    >
      {children}
    </Link>
  );
}
