"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "motion/react";
import { AboutSection } from "@/components/sections/about";
import { CapabilitiesSection } from "@/components/sections/capabilities";
import { ContactSection } from "@/components/sections/contact";
import { ExperienceSection } from "@/components/sections/experience";
import { HeroSection } from "@/components/sections/hero";
import { WorkSection } from "@/components/sections/work";
import { CommandPalette } from "@/components/layout/command-palette";
import { OrbitalNav } from "@/components/layout/orbital-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SpaceFallback } from "@/components/space/fallback";
import { PortfolioProvider } from "@/hooks/use-portfolio";

const SpaceStage = dynamic(
  () =>
    import("@/components/space/space-stage").then((mod) => mod.SpaceStage),
  { ssr: false, loading: () => <SpaceFallback /> },
);

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <PortfolioProvider>
        <SpaceStage />
        <SiteHeader />
        <OrbitalNav />
        <main>
          <HeroSection />
          <WorkSection />
          <ExperienceSection />
          <CapabilitiesSection />
          <AboutSection />
          <ContactSection />
        </main>
        <SiteFooter />
        <CommandPalette />
      </PortfolioProvider>
    </MotionConfig>
  );
}
