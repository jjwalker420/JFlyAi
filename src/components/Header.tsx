"use client";

import { useEffect, useState } from "react";
import { DenverClock } from "./DenverClock";

const NAV: Array<{ href: string; label: string }> = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#setup", label: "What's included" },
  { href: "#cta", label: "Book a call" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200 ease-out ${
        scrolled
          ? "border-b border-bone/12 bg-ink-black/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-2">
        <a
          href="#hero"
          className="font-display text-2xl font-bold leading-none text-bone"
          aria-label="JFly.ai — return to top"
        >
          <span className="border-b-2 border-trust-blue pb-1">JFly.ai</span>
        </a>
        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV.filter((n) => n.href !== "#cta").map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="text-base text-bone transition-colors duration-200 hover:text-trust-blue-tint"
                >
                  {n.label}
                </a>
              </li>
            ))}
            <li aria-hidden="true">
              <DenverClock />
            </li>
            <li>
              <a
                href="https://cal.com/jjwalker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-md bg-sunset-orange px-5 py-2 font-display font-semibold text-ink-black transition-colors duration-200 hover:bg-sunset-yellow"
              >
                Book a call
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
