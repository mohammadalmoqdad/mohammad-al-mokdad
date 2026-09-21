"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Camera,
  CanvasTexture,
  Points,
  ShaderMaterial,
  Vector3,
} from "three";
import { createStarMaterial } from "@/lib/star-shader";
import { journey } from "@/lib/journey-store";
import { skyStats } from "@/lib/sky-stats";
import type { IStarCloudProps } from "@/types/space";

function StarCloud({
  data,
  attenuate,
  depthTest,
  map,
  parallax,
  statKey,
}: IStarCloudProps) {
  const points = useRef<Points>(null);
  const lastStat = useRef(0);
  const material = useMemo(
    () => createStarMaterial({ attenuate, depthTest, map }),
    [attenuate, depthTest, map],
  );
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(data.positions, 3));
    geo.setAttribute("aSize", new BufferAttribute(data.sizes, 1));
    geo.setAttribute("aBright", new BufferAttribute(data.brights, 1));
    geo.setAttribute("aTint", new BufferAttribute(data.tints, 3));
    geo.setAttribute("aTwinkle", new BufferAttribute(data.twinkles, 1));
    return geo;
  }, [data]);
  const scratch = useMemo(() => new Vector3(), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    const mat = points.current?.material;
    if (!(mat instanceof ShaderMaterial)) {
      return;
    }
    mat.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    mat.uniforms.uTime.value = journey.reducedMotion
      ? 0
      : state.clock.elapsedTime;
    if (attenuate && points.current && !journey.reducedMotion) {
      points.current.position.z += journey.velocity * parallax * 0.012;
      if (Math.abs(points.current.position.z) > 8) {
        points.current.position.z = 0;
      }
      points.current.rotation.y +=
        delta * (0.004 + journey.transit * parallax * 0.018);
    }
    if (!statKey || !points.current) {
      return;
    }
    if (state.clock.elapsedTime - lastStat.current < 0.5) {
      return;
    }
    lastStat.current = state.clock.elapsedTime;
    countVisible(points.current, data.positions, scratch, state.camera, statKey);
  });

  return (
    <points
      ref={points}
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={-10}
    />
  );
}

function countVisible(
  points: Points,
  positions: Float32Array,
  scratch: Vector3,
  camera: Camera,
  statKey: "field" | "hero",
): void {
  points.updateWorldMatrix(true, false);
  const count = positions.length / 3;
  const step = Math.max(1, Math.floor(count / 80));
  let visible = 0;
  let sampled = 0;
  for (let i = 0; i < count; i += step) {
    scratch.fromArray(positions, i * 3);
    scratch.applyMatrix4(points.matrixWorld);
    scratch.project(camera);
    sampled += 1;
    if (
      scratch.z < 1 &&
      Math.abs(scratch.x) <= 1 &&
      Math.abs(scratch.y) <= 1
    ) {
      visible += 1;
    }
  }
  const estimate = sampled === 0 ? 0 : Math.round((visible / sampled) * count);
  if (statKey === "field") {
    skyStats.field = count;
    skyStats.fieldVisible = estimate;
    return;
  }
  skyStats.hero = count;
  skyStats.heroVisible = estimate;
}

export function useStarTexture(
  canvas: HTMLCanvasElement | null,
): CanvasTexture | null {
  const texture = useMemo(
    () => (canvas ? new CanvasTexture(canvas) : null),
    [canvas],
  );
  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);
  return texture;
}

export { StarCloud };
