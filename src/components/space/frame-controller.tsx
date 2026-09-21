"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { journey, subscribeJourneyFrame } from "@/lib/journey-store";

const TWINKLE_MS = 125;

export function FrameController() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let rest = 0;
    const stopIdle = () => {
      if (rest) {
        window.clearInterval(rest);
        rest = 0;
      }
    };
    const startIdle = () => {
      if (rest || document.hidden) {
        return;
      }
      rest = window.setInterval(() => {
        if (
          document.hidden ||
          journey.reducedMotion ||
          journey.t >= 1
        ) {
          stopIdle();
          return;
        }
        invalidate();
      }, TWINKLE_MS);
    };
    const onVis = () => {
      if (document.hidden) {
        stopIdle();
        return;
      }
      invalidate();
      startIdle();
    };
    document.addEventListener("visibilitychange", onVis);
    startIdle();
    const unsub = subscribeJourneyFrame(() => {
      invalidate();
      if (!document.hidden && !journey.reducedMotion && journey.t < 1) {
        startIdle();
      } else {
        stopIdle();
      }
    });
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stopIdle();
      unsub();
    };
  }, [invalidate]);

  return null;
}
