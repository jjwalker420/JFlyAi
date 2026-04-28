import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionShell } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Terms — JFly.ai",
  description: "Terms of service for JFly.ai consulting engagements.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <SectionShell
          id="terms"
          scene="terms"
          ariaLabel="Terms of Service"
          contentWidth="text"
          className="pt-32"
        >
          <h1 className="font-display text-4xl font-medium text-bone mb-8">
            Terms of Service
          </h1>
          <div className="font-body text-base text-bone/85 leading-relaxed space-y-4">
            <p>
              Terms of service are being finalized. Current commercial
              relationships (AiOS Audit / Setup / Retainer) are governed by
              the engagement letter signed at booking. Questions?{" "}
              <a
                href="mailto:jj@jfly.ai"
                className="text-bone/70 underline-offset-4 transition-colors duration-200 hover:text-trust-blue"
              >
                Email jj@jfly.ai
              </a>
              .
            </p>
          </div>
          <p className="mt-12 font-mono text-[0.75rem] text-bone/50">
            Last updated: April 28, 2026
          </p>
        </SectionShell>
      </main>
      <Footer />
    </>
  );
}
