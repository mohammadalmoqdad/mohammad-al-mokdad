"use client";

import { useEffect } from "react";
import { useIsMobile, useIsTablet } from "@/hooks/use-media";
import { setJourneyQuality } from "@/lib/journey-store";
import type { TSpaceQuality } from "@/types/space";

export function scaleForQuality(quality: TSpaceQuality): number {
  if (quality === "low") {
    return 0.3;
  }
  if (quality === "medium") {
    return 0.7;
  }
  return 1;
}

export function useQualityTier(): TSpaceQuality {
  const mobile = useIsMobile();
  const tablet = useIsTablet();
  const quality: TSpaceQuality = mobile ? "low" : tablet ? "medium" : "high";

  useEffect(() => {
    setJourneyQuality(quality);
  }, [quality]);

  return quality;
}
