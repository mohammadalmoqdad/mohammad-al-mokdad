"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ACESFilmicToneMapping } from "three";
import { CameraDirector } from "@/components/space/camera-director";
import { CorridorWorld } from "@/components/space/corridor-world";
import { FrameController } from "@/components/space/frame-controller";
import { SpaceFallback } from "@/components/space/fallback";
import { CelestialSphere } from "@/components/space/sky/celestial-sphere";
import { StarField } from "@/components/space/star-field";
import { useQualityTier } from "@/hooks/use-quality-tier";
import { usePrefersReducedMotion } from "@/hooks/use-media";
import { detectWebGL } from "@/lib/utils";
import {
  getSceneReady,
  journey,
  setJourneyQuality,
  subscribeSceneReady,
} from "@/lib/journey-store";
import { MONO } from "@/data/mono-palette";
import type { ISpaceSceneProps, TSpaceQuality } from "@/types/space";

function subscribeWebGL() {
  return () => undefined;
}

function stepDown(quality: TSpaceQuality): TSpaceQuality {
  if (quality === "high") {
    return "medium";
  }
  return "low";
}

function SpaceScene({ quality }: ISpaceSceneProps) {
  return (
    <>
      <color attach="background" args={[MONO.void]} />
      <CelestialSphere />
      <StarField quality={quality} />
      <CorridorWorld />
      <CameraDirector />
      <FrameController />
    </>
  );
}

function SpaceCanvas() {
  const viewportQuality = useQualityTier();
  const [gpuQuality, setGpuQuality] = useState<TSpaceQuality | null>(null);
  const quality = gpuQuality ?? viewportQuality;
  const dpr = quality === "low" ? 1 : quality === "medium" ? 1.15 : 1.5;

  return (
    <Canvas
      className="h-full w-full"
      dpr={dpr}
      frameloop="demand"
      gl={{
        antialias: quality !== "low",
        alpha: false,
        powerPreference: quality === "high" ? "high-performance" : "default",
        stencil: false,
      }}
      camera={{ fov: quality === "low" ? 48 : 42, near: 0.1, far: 140 }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor(MONO.void, 1);
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        invalidate();
      }}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        onDecline={() => {
          const idle =
            journey.transit < 0.05 &&
            !journey.warp &&
            Math.abs(journey.velocity) < 0.08;
          if (idle) {
            return;
          }
          const next = stepDown(quality);
          setGpuQuality(next);
          setJourneyQuality(next);
        }}
        onIncline={() => {
          setGpuQuality(null);
          setJourneyQuality(viewportQuality);
        }}
      />
      <Suspense fallback={null}>
        <SpaceScene quality={quality} />
      </Suspense>
    </Canvas>
  );
}

export function SpaceStage() {
  const hasWebGL = useSyncExternalStore(
    subscribeWebGL,
    detectWebGL,
    () => false,
  );
  const ready = useSyncExternalStore(
    subscribeSceneReady,
    getSceneReady,
    () => false,
  );
  const reduced = usePrefersReducedMotion();
  const [canvasFadedIn, setCanvasFadedIn] = useState(() => getSceneReady());
  const shell = useRef<HTMLDivElement>(null);
  const showFallback = !ready || (!reduced && !canvasFadedIn);

  useEffect(() => {
    if (!ready || reduced) {
      return;
    }
    const node = shell.current;
    if (!node) {
      return;
    }
    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName === "opacity") {
        setCanvasFadedIn(true);
      }
    };
    node.addEventListener("transitionend", onEnd);
    return () => {
      node.removeEventListener("transitionend", onEnd);
    };
  }, [ready, reduced]);

  if (!hasWebGL) {
    return <SpaceFallback />;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {showFallback ? <SpaceFallback /> : null}
      <div
        ref={shell}
        className="space-canvas-shell"
        data-ready={ready ? "true" : "false"}
      >
        <SpaceCanvas />
      </div>
    </div>
  );
}
