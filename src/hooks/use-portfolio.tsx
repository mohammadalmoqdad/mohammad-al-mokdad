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
import { portfolio } from "@/data/portfolio";
import { useSectionObserver } from "@/hooks/use-section-observer";
import { useCoarsePointer, useIsMobile, useIsTablet, usePrefersReducedMotion } from "@/hooks/use-media";
import { setSpaceQuality, setSpaceSection, spaceRuntime } from "@/lib/space-runtime";
import type { IPortfolioContextValue } from "@/types/ui";
import type { TSectionId } from "@/types/portfolio";

const PortfolioContext = createContext<IPortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<TSectionId>("hero");
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeWorkId, setActiveWorkId] = useState(portfolio.work.items[0].id);
  const [activeExperienceId, setActiveExperienceId] = useState(
    portfolio.experience.items[0].id,
  );
  const [activeCapabilityId, setActiveCapabilityId] = useState(
    portfolio.capabilities.items[0].id,
  );
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const tablet = useIsTablet();
  const coarse = useCoarsePointer();

  const handleSectionChange = useCallback((id: TSectionId) => {
    setActiveSection((current) => (current === id ? current : id));
  }, []);

  useSectionObserver(handleSectionChange);

  useEffect(() => {
    setSpaceSection(activeSection);
  }, [activeSection]);

  useEffect(() => {
    spaceRuntime.workId = activeWorkId;
  }, [activeWorkId]);

  useEffect(() => {
    spaceRuntime.experienceId = activeExperienceId;
  }, [activeExperienceId]);

  useEffect(() => {
    spaceRuntime.capabilityId = activeCapabilityId;
  }, [activeCapabilityId]);

  useEffect(() => {
    spaceRuntime.reducedMotion = reduced;
    setSpaceQuality(mobile ? "mobile" : tablet ? "tablet" : "desktop");
  }, [mobile, reduced, tablet]);

  useEffect(() => {
    if (coarse) {
      spaceRuntime.pointerX = 0;
      spaceRuntime.pointerY = 0;
      return;
    }

    const onMove = (event: PointerEvent) => {
      spaceRuntime.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      spaceRuntime.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [coarse]);

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
