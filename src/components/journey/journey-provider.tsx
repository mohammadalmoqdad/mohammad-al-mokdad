"use client";

import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import { PortfolioProvider } from "@/hooks/use-portfolio";
import { useJourneyProgress } from "@/hooks/use-journey-progress";
import { useCoarsePointer } from "@/hooks/use-media";
import { journey, notifyJourneyFrame, notifyPointerUi, pointerUi } from "@/lib/journey-store";
import type { IJourneyProviderProps } from "@/types/ui";

export function JourneyProvider({ children }: IJourneyProviderProps) {
  return (
    <MotionConfig reducedMotion="user">
      <PortfolioProvider>
        {children}
        <JourneyRuntime />
      </PortfolioProvider>
    </MotionConfig>
  );
}

function JourneyRuntime() {
  useJourneyProgress();
  const coarse = useCoarsePointer();

  useEffect(() => {
    if (coarse) {
      journey.pointerX = 0;
      journey.pointerY = 0;
      notifyJourneyFrame();
      return;
    }
    const onMove = (event: PointerEvent) => {
      pointerUi.clientX = event.clientX;
      pointerUi.clientY = event.clientY;
      pointerUi.target = event.target;
      journey.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      journey.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      notifyPointerUi();
      if (journey.transit < 0.2) {
        notifyJourneyFrame();
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [coarse]);

  return null;
}
