import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main"
        className="relative flex min-h-screen items-center justify-center bg-ink-black px-6 py-24 warm-section"
      >
        <div className="relative z-10 w-full max-w-[720px] text-center">
          {/* Eyebrow */}
          <p className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.15em] text-lamp-amber mb-6">
            ERROR · 404
          </p>

          {/* Display heading */}
          <h1 className="font-display text-5xl font-medium text-bone mb-6 md:text-6xl">
            Signal lost.
          </h1>

          {/* Body */}
          <p className="font-body text-lg text-bone/80 mb-10 max-w-[480px] mx-auto">
            The page you tried to reach doesn&rsquo;t exist (or moved). Let&rsquo;s
            get you back to the operating console.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-md px-7 py-4 text-[1.125rem] font-bold font-display bg-amber-flame text-deep-stone transition-all duration-200 hover:bg-horizon-gold"
            >
              ← Back to JFly.ai
            </Link>
            <a
              href="https://cal.com/jjwalker/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-base text-trust-blue underline-offset-4 transition-colors duration-200 hover:underline"
            >
              Book a 30-min call →
            </a>
          </div>

          {/* CRT phosphor easter egg */}
          <p
            data-era="1985"
            className="font-vintage text-[1.25rem] text-crt-phosphor-green mt-20 opacity-60"
          >
            READY.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
