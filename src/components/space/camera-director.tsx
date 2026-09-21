"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Vector3 } from "three";
import { DESTINATIONS, TELESCOPE_POS } from "@/data/journey";
import { buildJourneyCurves, sampleSegment } from "@/lib/curves";
import { journey, markSceneReady } from "@/lib/journey-store";
import { scaleForQuality, useQualityTier } from "@/hooks/use-quality-tier";

const SETTLE = 0.0008;

export function CameraDirector() {
  const quality = useQualityTier();
  const xScale = scaleForQuality(quality);
  const curves = useMemo(() => buildJourneyCurves(xScale), [xScale]);
  const desired = useRef(new Vector3());
  const desiredLook = useRef(new Vector3());
  const lookCurrent = useRef(new Vector3(...DESTINATIONS[0].rest.look));
  const eyepiece = useRef(new Vector3());
  const initialized = useRef(false);

  useFrame((state, delta) => {
    sampleSegment(curves.cam, journey.t, xScale, "cam", desired.current);
    sampleSegment(curves.look, journey.t, xScale, "look", desiredLook.current);

    if (journey.quality === "high" && !journey.reducedMotion && journey.transit < 0.2) {
      desired.current.x += journey.pointerX * 0.2 * (1 - journey.transit);
      desired.current.y += -journey.pointerY * 0.12 * (1 - journey.transit);
    }

    if (
      journey.lensFocus > 0.02 &&
      journey.t < 1 &&
      !journey.reducedMotion &&
      !journey.warp
    ) {
      eyepiece.current.set(
        TELESCOPE_POS[0] * xScale,
        TELESCOPE_POS[1],
        TELESCOPE_POS[2],
      );
      desired.current.lerp(eyepiece.current, journey.lensFocus * 0.1);
    }

    if (!journey.booted) {
      return;
    }

    if (!initialized.current || journey.snap || journey.reducedMotion) {
      state.camera.position.copy(desired.current);
      lookCurrent.current.copy(desiredLook.current);
      state.camera.lookAt(lookCurrent.current);
      state.camera.up.set(0, 1, 0);
      initialized.current = true;
      journey.snap = false;
      markSceneReady();
      return;
    }

    const damping = journey.warp ? 6 : 2.2;
    const lambda = 1 - Math.exp(-damping * delta);
    state.camera.position.lerp(desired.current, lambda);
    lookCurrent.current.lerp(desiredLook.current, lambda);
    state.camera.lookAt(lookCurrent.current);
    state.camera.up.set(0, 1, 0);
    const unsettled =
      state.camera.position.distanceTo(desired.current) > SETTLE ||
      lookCurrent.current.distanceTo(desiredLook.current) > SETTLE;
    if (unsettled) {
      state.invalidate();
    }
  });

  return null;
}
