"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DESTINATIONS } from "@/data/journey";
import { portfolio } from "@/data/portfolio";
import { useJourneyUi } from "@/hooks/use-journey-ui";
import { journey } from "@/lib/journey-store";
import { scrollToSection } from "@/lib/utils";
import type { IPortfolioContextValue } from "@/types/ui";
import type { TSectionId } from "@/types/portfolio";

const PortfolioContext = createContext<IPortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const ui = useJourneyUi();
  const activeSection =
    DESTINATIONS[ui.transit > 0.45 ? ui.to : ui.from]?.id ?? "hero";
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeWorkId, setActiveWorkId] = useState(portfolio.work.items[0].id);
  const [activeExperienceId, setActiveExperienceId] = useState(
    portfolio.experience.items[0].id,
  );
  const [activeCapabilityId, setActiveCapabilityId] = useState(
    portfolio.capabilities.items[0].id,
  );

  const setActiveSection = useCallback((id: TSectionId) => {
    scrollToSection(id);
  }, []);

  useEffect(() => {
    journey.workId = activeWorkId;
  }, [activeWorkId]);

  useEffect(() => {
    journey.experienceId = activeExperienceId;
  }, [activeExperienceId]);

  useEffect(() => {
    journey.capabilityId = activeCapabilityId;
  }, [activeCapabilityId]);

  const value = useMemo<IPortfolioContextValue>(
    () => ({
      activeSection,
      setActiveSection,
      openProjectId,
      setOpenProjectId,
      commandOpen,
      setCommandOpen,
      activeWorkId,
      setActiveWorkId,
      activeExperienceId,
      setActiveExperienceId,
      activeCapabilityId,
      setActiveCapabilityId,
    }),
    [
      activeCapabilityId,
      activeExperienceId,
      activeSection,
      activeWorkId,
      commandOpen,
      openProjectId,
      setActiveSection,
    ],
  );

  return (
    <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
  );
}

export function usePortfolio(): IPortfolioContextValue {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }

  return context;
}
