"use client";

import { useEffect, useState } from "react";
import { journey } from "@/lib/journey-store";
import type { IJourneyState } from "@/types/space";

export function useJourneyUi(): Pick<
  IJourneyState,
  | "t"
  | "transit"
  | "from"
  | "to"
  | "warp"
  | "quality"
  | "telescopeAim"
  | "lensFocus"
  | "telescopeVisible"
> {
  const [snap, setSnap] = useState({
    t: journey.t,
    transit: journey.transit,
    from: journey.from,
    to: journey.to,
    warp: journey.warp,
    quality: journey.quality,
    telescopeAim: journey.telescopeAim,
    lensFocus: journey.lensFocus,
    telescopeVisible: journey.telescopeVisible,
  });

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setSnap((current) => {
        if (
          Math.abs(current.t - journey.t) < 0.01 &&
          Math.abs(current.transit - journey.transit) < 0.02 &&
          Math.abs(current.lensFocus - journey.lensFocus) < 0.02 &&
          current.from === journey.from &&
          current.to === journey.to &&
          current.warp === journey.warp &&
          current.quality === journey.quality
        ) {
          return current;
        }
        return {
          t: journey.t,
          transit: journey.transit,
          from: journey.from,
          to: journey.to,
          warp: journey.warp,
          quality: journey.quality,
          telescopeAim: journey.telescopeAim,
          lensFocus: journey.lensFocus,
          telescopeVisible: journey.telescopeVisible,
        };
      });
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return snap;
}
