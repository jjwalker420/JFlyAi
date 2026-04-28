import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TermlyEmbed } from "@/components/TermlyEmbed";

export const metadata: Metadata = {
  title: "Privacy — JFly.ai",
  description: "Privacy practices for jfly.ai inquiries and intake form data.",
  robots: { index: true, follow: true },
};

const TERMLY_WEBSITE_UUID = "f3b42b48-c745-4a76-85ca-90c7f0c26ce4";
const TERMLY_PRIVACY_POLICY_UUID = "c792f35b-47be-4b09-9c03-a484d5365cfe";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-ink-black min-h-screen pt-32 pb-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <TermlyEmbed
            policyId={TERMLY_PRIVACY_POLICY_UUID}
            websiteId={TERMLY_WEBSITE_UUID}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
