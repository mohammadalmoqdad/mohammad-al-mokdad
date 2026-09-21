"use client";

import { useEffect, useMemo, useState } from "react";
import { AdditiveBlending, BackSide } from "three";
import { CELESTIAL_RADIUS } from "@/data/sky";
import { MONO } from "@/data/mono-palette";
import { bakeDeepHaze } from "@/lib/bake-sky-maps";
import { enqueueIdle } from "@/lib/idle-work";
import { useQualityTier } from "@/hooks/use-quality-tier";
import { useStarTexture } from "@/components/space/sky/star-cloud";

export function DeepHaze() {
  const quality = useQualityTier();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (quality === "low") {
      return;
    }
    enqueueIdle(() => setCanvas(bakeDeepHaze(quality === "high" ? "high" : "medium")));
  }, [quality]);

  const map = useStarTexture(canvas);
  const opacity = quality === "high" ? 0.045 : 0.035;
  const radius = useMemo(() => CELESTIAL_RADIUS - 1, []);

  if (quality === "low" || !map) {
    return null;
  }

  return (
    <mesh renderOrder={-12}>
      <sphereGeometry args={[radius, 48, 32]} />
      <meshBasicMaterial
        map={map}
        color={MONO.mist}
        transparent
        opacity={opacity}
        depthWrite={false}
        depthTest
        side={BackSide}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
