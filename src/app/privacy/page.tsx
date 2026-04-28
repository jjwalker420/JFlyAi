import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy — JFly.ai",
  description: "Privacy practices for jfly.ai inquiries and intake form data.",
  robots: { index: true, follow: true },
};

// Termly-hosted policy — direct iframe, no JS timing issues in Next.js SPA
const TERMLY_POLICY_URL =
  "https://app.termly.io/policy-viewer/policy.html?policyUUID=c792f35b-47be-4b09-9c03-a484d5365cfe";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-ink-black min-h-screen pt-28 pb-16 px-4">
        <div className="mx-auto max-w-[860px]">
          {/* Plain iframe — reliable across SPA navigation, always shows latest Termly version */}
          <iframe
            src={TERMLY_POLICY_URL}
            title="Privacy Policy"
            width="100%"
            style={{
              minHeight: "80vh",
              border: "none",
              borderRadius: "4px",
              background: "white",
            }}
            loading="lazy"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
