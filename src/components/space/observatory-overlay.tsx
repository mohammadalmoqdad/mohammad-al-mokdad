"use client";

import { useCallback } from "react";
import { useCoarsePointer, useIsMobile, useIsTablet } from "@/hooks/use-media";
import { useJourneyUi } from "@/hooks/use-journey-ui";
import { scrollToSection } from "@/lib/utils";

export function ObservatoryOverlay() {
  const ui = useJourneyUi();
  const coarse = useCoarsePointer();
  const mobile = useIsMobile();
  const tablet = useIsTablet();
  const showControl =
    !coarse &&
    !mobile &&
    !tablet &&
    ui.telescopeVisible > 0.35 &&
    ui.t < 0.7 &&
    !ui.warp;

  const handleObserve = useCallback(() => {
    scrollToSection("work");
  }, []);

  return (
    <>
      <div className="lens-vignette" aria-hidden="true" />
      {showControl ? (
        <button
          type="button"
          className="telescope-hit"
          aria-label="View selected work"
          onClick={handleObserve}
        >
          <span>VIEW WORK</span>
        </button>
      ) : null}
    </>
  );
}
