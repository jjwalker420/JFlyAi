import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PCBTexture } from "@/components/PCBTexture";
import { getPublicArchitecture } from "@/data/architecture";
import { ArchitectureScene } from "./ArchitectureScene";

export const metadata: Metadata = {
  title: "AiOS Architecture — A Personal AI Operating System | JFly.ai",
  description:
    "An AiOS has 8 layers — the personal AI operating system that ships with every in-person Claude Desktop setup by JFly.ai in Denver.",
  alternates: { canonical: "/architecture" },
  openGraph: {
    type: "article",
    url: "https://www.jfly.ai/architecture",
    title: "AiOS Architecture — A Personal AI Operating System | JFly.ai",
    description:
      "An AiOS has 8 layers — the personal AI operating system that ships with every in-person Claude Desktop setup by JFly.ai in Denver.",
    siteName: "JFly.ai",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiOS Architecture — A Personal AI Operating System | JFly.ai",
    description:
      "An AiOS has 8 layers — the personal AI operating system that ships with every in-person Claude Desktop setup by JFly.ai in Denver.",
  },
};

export default function ArchitecturePage() {
  const arch = getPublicArchitecture();

  return (
    <>
      <PCBTexture />
      <Header />
      <main id="main">
        <ArchitectureScene
          arch={{ tiers: arch.tiers, nodes: arch.nodes }}
        />
      </main>
      <Footer />
    </>
  );
}
