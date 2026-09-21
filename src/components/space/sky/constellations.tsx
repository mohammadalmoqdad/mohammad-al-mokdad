"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  Camera,
  Float32BufferAttribute,
  LineBasicMaterial,
  Vector3,
} from "three";
import {
  CONSTELLATIONS,
  FALLBACK_SKY_PLACEMENT,
  SKY_PLACEMENTS,
  SKY_WINDOWS,
} from "@/data/sky";
import { MONO } from "@/data/mono-palette";
import { journey } from "@/lib/journey-store";
import { smoothstep } from "@/lib/math";
import {
  isInTextSafeCone,
  skyPoint,
  textSafeDestinations,
} from "@/lib/sky-placement";
import { setSkyLabels } from "@/lib/sky-stats";
import { scaleForQuality, useQualityTier } from "@/hooks/use-quality-tier";
import { useIsMobile, useIsTablet } from "@/hooks/use-media";
import type {
  IConstellation,
  IConstellationLinesProps,
  ISkyLabelCandidate,
  ISkyWindow,
} from "@/types/space";

const MID = new Vector3();
const PROJECT = new Vector3();

function windowShape(window: ISkyWindow): number {
  const mid = (window.tStart + window.tEnd) / 2;
  const half = Math.max(0.12, (window.tEnd - window.tStart) / 2);
  return 1 - smoothstep(0, half, Math.abs(journey.t - mid));
}

function lineOpacity(window: ISkyWindow, textSafe: boolean): number {
  const shape = windowShape(window);
  const restFloor = 0.28;
  const peak = Math.max(window.peakOpacity, 0.62);
  const warped = journey.warp ? 0.4 : 1;
  const opacity = restFloor + (peak - restFloor) * shape * warped;
  return textSafe ? opacity * 0.7 : opacity;
}

function fillCentroid(item: IConstellation, xScale: number, target: Vector3): Vector3 {
  const placement = SKY_PLACEMENTS[item.id] ?? FALLBACK_SKY_PLACEMENT;
  target.set(0, 0, 0);
  item.stars.forEach((star) => {
    const point = skyPoint(placement, star.x, star.y, xScale);
    target.add(point);
  });
  return target.multiplyScalar(1 / Math.max(1, item.stars.length));
}

function pushProjected(
  into: ISkyLabelCandidate[],
  id: string,
  text: string,
  world: Vector3,
  camera: Camera,
  width: number,
  height: number,
  xScale: number,
  weight: number,
): void {
  PROJECT.copy(world).project(camera);
  const onScreen =
    PROJECT.z < 1 && Math.abs(PROJECT.x) <= 0.96 && Math.abs(PROJECT.y) <= 0.96;
  const safe = textSafeDestinations().some((dest) =>
    isInTextSafeCone(world, dest, xScale),
  );
  into.push({
    id,
    text,
    x: Math.round((PROJECT.x * 0.5 + 0.5) * width),
    y: Math.round((-PROJECT.y * 0.5 + 0.5) * height),
    visible: onScreen && !safe && weight > 0.12,
    weight,
  });
}

function ConstellationLines({ item, xScale }: IConstellationLinesProps) {
  const material = useRef<LineBasicMaterial>(null);
  const geometry = useMemo(() => {
    const placement = SKY_PLACEMENTS[item.id];
    const positions: number[] = [];
    item.lines.forEach(([from, to]) => {
      const a = item.stars.find((star) => star.id === from);
      const b = item.stars.find((star) => star.id === to);
      if (!a || !b || !placement) {
        return;
      }
      const pa = skyPoint(placement, a.x, a.y, xScale);
      const pb = skyPoint(placement, b.x, b.y, xScale);
      positions.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
    });
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, [item, xScale]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame(() => {
    const window = SKY_WINDOWS[item.id];
    if (!material.current || !window) {
      return;
    }
    fillCentroid(item, xScale, MID);
    const safe = textSafeDestinations().some((dest) =>
      isInTextSafeCone(MID, dest, xScale),
    );
    material.current.opacity = lineOpacity(window, safe);
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false} renderOrder={-9}>
      <lineBasicMaterial
        ref={material}
        color={MONO.paper}
        transparent
        opacity={0.32}
        depthWrite={false}
        depthTest
        toneMapped={false}
      />
    </lineSegments>
  );
}

export function Constellations() {
  const quality = useQualityTier();
  const xScale = scaleForQuality(quality);
  const mobile = useIsMobile();
  const tablet = useIsTablet();
  const { camera, size } = useThree();
  const lastKey = useRef("");
  const items = useMemo(
    () =>
      CONSTELLATIONS.filter((item) =>
        quality === "low"
          ? item.id === "orion" || item.id === "ursa-major"
          : true,
      ),
    [quality],
  );

  useEffect(() => {
    return () => setSkyLabels([]);
  }, []);

  useFrame(() => {
    const maxLabels = mobile || tablet ? 1 : 4;
    const candidates: ISkyLabelCandidate[] = [];
    if (mobile) {
      pushProjected(
        candidates,
        "polaris",
        "POLARIS",
        skyPoint(SKY_PLACEMENTS.polaris ?? FALLBACK_SKY_PLACEMENT, 0, 0, xScale),
        camera,
        size.width,
        size.height,
        xScale,
        1,
      );
    } else {
      items.forEach((item) => {
        const window = SKY_WINDOWS[item.id];
        const place = SKY_PLACEMENTS[item.id];
        if (!window || !place) {
          return;
        }
        const shape = windowShape(window);
        if (shape < 0.22) {
          return;
        }
        pushProjected(
          candidates,
          item.id,
          item.name,
          fillCentroid(item, xScale, MID).clone(),
          camera,
          size.width,
          size.height,
          xScale,
          shape,
        );
        item.named.forEach((starId) => {
          const star = item.stars.find((entry) => entry.id === starId);
          if (!star) {
            return;
          }
          pushProjected(
            candidates,
            star.id,
            star.name,
            skyPoint(place, star.x, star.y, xScale),
            camera,
            size.width,
            size.height,
            xScale,
            shape + 0.05,
          );
        });
      });
      pushProjected(
        candidates,
        "polaris",
        "POLARIS",
        skyPoint(SKY_PLACEMENTS.polaris ?? FALLBACK_SKY_PLACEMENT, 0, 0, xScale),
        camera,
        size.width,
        size.height,
        xScale,
        journey.t < 0.7 ? 0.9 : 0.2,
      );
      pushProjected(
        candidates,
        "vega",
        "VEGA",
        skyPoint(SKY_PLACEMENTS.vega ?? FALLBACK_SKY_PLACEMENT, 0, 0, xScale),
        camera,
        size.width,
        size.height,
        xScale,
        Math.abs(journey.t - 0.5) < 0.45 ? 0.85 : 0.15,
      );
    }
    const picked = candidates
      .filter((item) => item.visible)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, maxLabels)
      .map(({ id, text, x, y, visible }) => ({ id, text, x, y, visible }));
    const key = picked.map((item) => `${item.id}:${item.x}:${item.y}`).join("|");
    if (key !== lastKey.current) {
      lastKey.current = key;
      setSkyLabels(picked);
    }
  });

  return (
    <group>
      {items.map((item) => (
        <ConstellationLines key={item.id} item={item} xScale={xScale} />
      ))}
    </group>
  );
}
