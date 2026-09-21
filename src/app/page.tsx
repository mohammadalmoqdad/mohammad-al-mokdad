import { AboutSection } from "@/components/sections/about";
import { CapabilitiesSection } from "@/components/sections/capabilities";
import { ContactSection } from "@/components/sections/contact";
import { ExperienceSection } from "@/components/sections/experience";
import { HeroSection } from "@/components/sections/hero";
import { WorkSection } from "@/components/sections/work";
import { JourneyProvider } from "@/components/journey/journey-provider";
import { CommandPalette } from "@/components/layout/command-palette";
import { JourneyMap } from "@/components/layout/journey-map";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JourneyDebug } from "@/components/space/debug-overlay";
import { ObservatoryOverlay } from "@/components/space/observatory-overlay";
import { SkyLabels } from "@/components/space/sky/sky-labels";
import { TelescopeCursor } from "@/components/layout/telescope-cursor";
import { SpaceStageLoader } from "@/components/space/space-stage-loader";

export default function Home() {
  return (
    <JourneyProvider>
      <SpaceStageLoader />
      <ObservatoryOverlay />
      <SkyLabels />
      <TelescopeCursor />
      <SiteHeader />
      <JourneyMap />
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
      <JourneyDebug />
    </JourneyProvider>
  );
}
