import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionShell } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Privacy — JFly.ai",
  description: "Privacy practices for jfly.ai inquiries and intake form data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main">
        <SectionShell
          id="privacy"
          scene="privacy"
          ariaLabel="Privacy Policy"
          contentWidth="text"
          className="pt-32"
        >
          <h1 className="font-display text-4xl font-medium text-bone mb-8">
            Privacy Policy
          </h1>
          <div className="font-body text-base text-bone/85 leading-relaxed space-y-4">
            <p>
              This privacy policy is being finalized. Until then, here&rsquo;s
              what you need to know: when you submit an intake form on jfly.ai,
              your name, email, and message are stored in a Supabase database
              that only JJ Walker can access. The data is used solely to
              evaluate AiOS engagement fit and respond to your inquiry. We
              don&rsquo;t share, sell, or use the data for advertising.
              Questions?{" "}
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
