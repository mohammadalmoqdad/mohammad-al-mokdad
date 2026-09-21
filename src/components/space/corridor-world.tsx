"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import { DESTINATIONS } from "@/data/journey";
import { MONO } from "@/data/mono-palette";
import {
  PLANET_AMBIENT,
  PLANET_FILL_LIGHT,
  PLANET_HEMI_GROUND,
  PLANET_HEMI_INTENSITY,
  PLANET_HEMI_SKY,
  PLANET_KEY_LIGHT,
} from "@/data/planet-look";
import { EngineeringCore } from "@/components/space/engineering-core";
import { MonoPlanet } from "@/components/space/planets/mono-planet";
import { ObservatoryTelescope } from "@/components/space/telescope";
import { scaleForQuality, useQualityTier } from "@/hooks/use-quality-tier";

export function CorridorWorld() {
  const quality = useQualityTier();
  const xScale = scaleForQuality(quality);
  const path = useMemo(
    () =>
      DESTINATIONS.map(
        (item) =>
          new Vector3(
            item.planetPos[0] * xScale,
            item.planetPos[1],
            item.planetPos[2],
          ),
      ),
    [xScale],
  );

  return (
    <group>
      <ambientLight color={MONO.mid} intensity={PLANET_AMBIENT} />
      <hemisphereLight
        color={PLANET_HEMI_SKY}
        groundColor={PLANET_HEMI_GROUND}
        intensity={PLANET_HEMI_INTENSITY}
      />
      <directionalLight
        position={PLANET_KEY_LIGHT.position}
        intensity={PLANET_KEY_LIGHT.intensity}
        color={PLANET_KEY_LIGHT.color}
      />
      <directionalLight
        position={PLANET_FILL_LIGHT.position}
        intensity={PLANET_FILL_LIGHT.intensity}
        color={PLANET_FILL_LIGHT.color}
      />
      <Line
        points={path}
        color={MONO.steel}
        lineWidth={0.6}
        transparent
        opacity={0.07}
        depthWrite={false}
      />
      <EngineeringCore xScale={xScale} />
      <ObservatoryTelescope xScale={xScale} />
      {DESTINATIONS.filter((item) => item.planet !== "core").map((item) => (
        <MonoPlanet key={item.id} destination={item} xScale={xScale} />
      ))}
    </group>
  );
}
