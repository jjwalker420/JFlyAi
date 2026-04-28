import type { Metadata } from "next";
import { Fraunces, Manrope, JetBrains_Mono, VT323 } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const vt323 = VT323({
  variable: "--font-vintage",
  subsets: ["latin"],
  weight: "400",
});

const SITE_URL = "https://jfly.ai";
const SITE_NAME = "JFly.ai";
const SITE_TITLE = "JFly.ai — JJ Walker builds your AiOS";
const SITE_DESCRIPTION =
  "JJ Walker installs your AiOS — the personalized setup of Claude, ChatGPT, and the tools that run your work — at your desk, in person, in Denver.";
const HERO_IMAGE = `${SITE_URL}/time-machine-hero.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "JJ Walker", url: SITE_URL }],
  creator: "JJ Walker",
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 630,
        alt: "JJ Walker's Time Machine — vintage workshop transitioning to a modern AI command station.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [HERO_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/**
 * Schema.org JSON-LD — Person (JJ Walker) + Service offer ladder
 *
 * Two schemas wired into the page <body> as application/ld+json blocks. Per
 * Brand persona = Solo-led with JJ Walker as the named operator (Patrick
 * Collison + Stripe pattern), the Person schema is the primary entity. The
 * Service ladder mirrors the locked offer (Audit / Setup / Retainer) from
 * COPY-VOICE.md §6 + service-offer specifications.
 *
 * AiOS spelling: lowercase i, every time (CLAUDE.md hard rule #1).
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "JJ Walker",
  jobTitle: "AiOS Installer",
  url: SITE_URL,
  worksFor: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Denver",
    addressRegion: "CO",
    addressCountry: "US",
  },
  description:
    "JJ Walker is a non-technical founder with 25 years of operating experience. He installs personalized AiOS setups (Claude, ChatGPT, AntiGravity, and supporting tools) at clients' desks in person in Denver.",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AiOS installation and consulting",
  provider: {
    "@type": "Person",
    name: "JJ Walker",
    url: SITE_URL,
  },
  areaServed: {
    "@type": "City",
    name: "Denver",
  },
  offers: [
    {
      "@type": "Offer",
      name: "AiOS Audit",
      description:
        "1-hour recorded call, 30-minute questionnaire, 15–30 minute final call, and a custom report (your AiOS plan, recommended LLM, integration tools, DIY path).",
      price: "599",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "AiOS Setup",
      description:
        "4-hour in-person session at your desk: tool installation (Claude desktop, ChatGPT desktop, AntiGravity), desktop file structure, integrations connected, one high-value automation, and a 30-day support window.",
      price: "1299",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Ongoing Retainer",
      description:
        "Monthly 1-hour optimization session, Slack support, new tool/skill/MCP integrations as Anthropic ships them, and a quarterly strategy review.",
      price: "999",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "999",
        priceCurrency: "USD",
        unitText: "MONTH",
      },
      availability: "https://schema.org/InStock",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable} ${vt323.variable}`}
    >
      <body className="bg-ink-black text-bone">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <div className="grain-overlay" aria-hidden="true" />
        <script
          type="application/ld+json"
          // Static schema; safe to render via dangerouslySetInnerHTML.
          // JSON.stringify escapes all user-controllable input by definition.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
      </body>
    </html>
  );
}
