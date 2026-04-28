import { PCBTexture } from "@/components/PCBTexture";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DiagnosticTest } from "@/components/DiagnosticTest";
import { AboutMe } from "@/components/AboutMe";
import { WhyThisMatters } from "@/components/WhyThisMatters";
import { ServicesPricing } from "@/components/ServicesPricing";
import { WhyInPersonDenver } from "@/components/WhyInPersonDenver";
import { WhatSetupMeans } from "@/components/WhatSetupMeans";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <PCBTexture />
      <Header />
      <main id="main">
        <Hero />
        <SectionDivider />
        <DiagnosticTest />
        <AboutMe />
        <WhyThisMatters />
        <ServicesPricing />
        <WhyInPersonDenver />
        <WhatSetupMeans />
        <SectionDivider />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
