"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Vector3 } from "three";
import { AmbientLights } from "@/components/space/ambient-lights";
import { EngineeringCore } from "@/components/space/engineering-core";
import { NamedStars } from "@/components/space/named-stars";
import { OrbitalPaths } from "@/components/space/orbital-paths";
import { SectionPlanets } from "@/components/space/section-planets";
import { SpaceFallback } from "@/components/space/fallback";
import { ShootingStar, StarField } from "@/components/space/star-field";
import { CAMERA_DAMPING, POINTER_STRENGTH, SECTION_STATES, SPACE_DPR } from "@/data/space-config";
import { useIsMobile, useIsTablet, usePrefersReducedMotion } from "@/hooks/use-media";
import { usePortfolio } from "@/hooks/use-portfolio";
import { detectWebGL } from "@/lib/utils";
import { spaceRuntime } from "@/lib/space-runtime";

function CameraRig() {
  const desired = useRef(new Vector3());
  const look = useRef(new Vector3());
    const currentLook = useRef(new Vector3(3.35, 0.1, -0.2));

  useFrame((state, delta) => {
    const config = SECTION_STATES[spaceRuntime.section];
    desired.current.set(...config.cameraPosition);
    look.current.set(...config.cameraTarget);

    if (spaceRuntime.quality === "mobile") {
      desired.current.x *= 0.35;
      desired.current.z = Math.min(desired.current.z + 1.6, 11);
    }

    if (spaceRuntime.quality === "desktop" && !spaceRuntime.reducedMotion) {
      desired.current.x += spaceRuntime.pointerX * POINTER_STRENGTH.x;
      desired.current.y += -spaceRuntime.pointerY * POINTER_STRENGTH.y;
    }

    const lambda = spaceRuntime.reducedMotion
      ? 1
      : 1 - Math.exp(-CAMERA_DAMPING * delta);
    state.camera.position.lerp(desired.current, lambda);
    currentLook.current.lerp(look.current, lambda);
    state.camera.lookAt(currentLook.current);
  });

  return null;
}

function SpaceScene() {
  const { activeSection, activeWorkId, activeExperienceId, activeCapabilityId } =
    usePortfolio();
  const mobile = useIsMobile();
  const tablet = useIsTablet();
  const reduced = usePrefersReducedMotion();
  const quality = mobile ? "mobile" : tablet ? "tablet" : "desktop";

  return (
    <>
      <AmbientLights />
      <StarField key={`stars-${quality}`} />
      <EngineeringCore />
      <OrbitalPaths />
      <SectionPlanets
        workId={activeWorkId}
        experienceId={activeExperienceId}
        capabilityId={activeCapabilityId}
        section={activeSection}
      />
      <NamedStars key={activeSection} />
      {quality === "desktop" && !reduced ? <ShootingStar /> : null}
      <CameraRig />
    </>
  );
}

function SpaceCanvas() {
  const mobile = useIsMobile();
  const tablet = useIsTablet();
  const quality = mobile ? "mobile" : tablet ? "tablet" : "desktop";
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    const sync = () => {
      setFrameloop(document.hidden ? "never" : "always");
    };
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <Canvas
      className="h-full w-full"
      dpr={SPACE_DPR[quality]}
      frameloop={frameloop}
      gl={{
        antialias: quality !== "mobile",
        alpha: true,
        powerPreference: quality === "desktop" ? "high-performance" : "default",
        stencil: false,
      }}
      camera={{
        fov: quality === "mobile" ? 48 : 42,
        near: 0.1,
        far: 90,
        position: SECTION_STATES.hero.cameraPosition,
      }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <SpaceScene />
      </Suspense>
    </Canvas>
  );
}

function subscribeWebGL() {
  return () => undefined;
}

export function SpaceStage() {
  const hasWebGL = useSyncExternalStore(
    subscribeWebGL,
    detectWebGL,
    () => false,
  );

  if (!hasWebGL) {
    return <SpaceFallback />;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      <SpaceCanvas />
    </div>
  );
}
