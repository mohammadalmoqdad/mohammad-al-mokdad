"use client";

import { useMemo } from "react";
import { useCoarsePointer, usePrefersReducedMotion } from "@/hooks/use-media";
import type { TMotionProfile } from "@/types/motion";

export function useMotionProfile(): TMotionProfile {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();

  return useMemo(() => {
    if (reduced) {
      return "static";
    }
    if (coarse) {
      return "lite";
    }
    return "full";
  }, [coarse, reduced]);
}
