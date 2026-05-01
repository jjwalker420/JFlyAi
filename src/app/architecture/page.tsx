import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PCBTexture } from "@/components/PCBTexture";
import { getPublicArchitecture } from "@/data/architecture";
import { ArchitectureScene } from "./ArchitectureScene";

export const metadata: Metadata = {
  title: "AiOS Architecture | JFly.ai",
  description:
    "An AiOS has 8 layers. Scroll the schematic — eight tiers of operator infrastructure that ship with every JFly.ai install.",
  alternates: { canonical: "/architecture" },
  openGraph: {
    type: "article",
    url: "https://www.jfly.ai/architecture",
    title: "AiOS Architecture | JFly.ai",
    description:
      "An AiOS has 8 layers. Scroll the schematic — eight tiers of operator infrastructure that ship with every JFly.ai install.",
    siteName: "JFly.ai",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiOS Architecture | JFly.ai",
    description:
      "An AiOS has 8 layers. Scroll the schematic — eight tiers of operator infrastructure that ship with every JFly.ai install.",
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
