import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PCBTexture } from "@/components/PCBTexture";
import { SectionDivider } from "@/components/SectionDivider";
import { getPublicArchitecture } from "@/data/architecture";
import { ArchitectureHero } from "./ArchitectureHero";
import { ArchitectureLeadIn } from "./ArchitectureLeadIn";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { TierNavigator } from "./TierNavigator";

export const metadata: Metadata = {
  title: "AiOS Architecture | JFly.ai",
  description:
    "How we build AI operating systems for solo founders — the 8-tier reference architecture behind every JFly.ai install.",
  alternates: { canonical: "/architecture" },
  openGraph: {
    type: "article",
    url: "https://www.jfly.ai/architecture",
    title: "AiOS Architecture | JFly.ai",
    description:
      "How we build AI operating systems for solo founders — the 8-tier reference architecture behind every JFly.ai install.",
    siteName: "JFly.ai",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiOS Architecture | JFly.ai",
    description:
      "How we build AI operating systems for solo founders — the 8-tier reference architecture behind every JFly.ai install.",
  },
};

export default function ArchitecturePage() {
  const arch = getPublicArchitecture();

  return (
    <>
      <PCBTexture />
      <Header />
      <main id="main">
        <ArchitectureHero
          lastUpdated={arch.lastUpdated}
          phasesShipped={arch.phasesShipped}
          phasesPending={arch.phasesPending}
        />
        <SectionDivider />
        <ArchitectureLeadIn />
        <TierNavigator tiers={arch.tiers} />
        <ArchitectureDiagram arch={arch} />
        <SectionDivider />
        <section
          id="cta"
          aria-labelledby="arch-cta-headline"
          className="px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-[720px] text-center">
            <h2
              id="arch-cta-headline"
              className="font-display text-[clamp(1.75rem,3vw,2.441rem)] font-semibold leading-tight tracking-tight text-bone"
            >
              Want to build your own?
            </h2>
            <p className="mx-auto mt-4 max-w-[560px] font-body text-[1.125rem] leading-[1.45] text-bone/80">
              An AiOS this deep takes months to build solo. The faster path is a
              one-on-one install at your desk.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="https://cal.com/jjwalker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-sunset-orange px-7 py-4 font-display text-[1.125rem] font-bold whitespace-nowrap text-ink-black transition-colors duration-200 hover:bg-sunset-yellow"
              >
                <span>Let&rsquo;s talk</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/#services"
                className="font-body text-[1.125rem] text-trust-blue-tint underline-offset-4 hover:underline"
              >
                See what&rsquo;s included
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
