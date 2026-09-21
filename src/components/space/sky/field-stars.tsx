"use client";

import { useMemo } from "react";
import {
  CONSTELLATIONS,
  FALLBACK_SKY_PLACEMENT,
  SKY_LAYER_COUNTS,
  SKY_PLACEMENTS,
} from "@/data/sky";
import { CELESTIAL_RADIUS } from "@/data/sky";
import { pickStarTint, skyPoint } from "@/lib/sky-placement";
import { valueNoise } from "@/lib/value-noise";
import { seededRandom } from "@/lib/utils";
import { scaleForQuality, useQualityTier } from "@/hooks/use-quality-tier";
import { StarCloud } from "@/components/space/sky/star-cloud";
import type { ISkyPlacement, IStarCloudData } from "@/types/space";

function sampleFieldDir(rand: () => number): [number, number, number] {
  let x = 0;
  let y = 1;
  let z = 0;
  for (let attempt = 0; attempt < 14; attempt += 1) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    x = Math.sin(phi) * Math.cos(theta);
    y = Math.cos(phi);
    z = Math.sin(phi) * Math.sin(theta);
    const dens = 0.35 + 0.65 * valueNoise(x * 2.2 + 4, y * 2.2, 16);
    const band = 1 - Math.min(1, Math.abs(y * 0.5 + z * 0.86) / 0.28);
    if (rand() < dens * (1 + Math.max(0, band) * 1.4)) {
      break;
    }
  }
  return [x, y, z];
}

function writeStar(
  data: IStarCloudData,
  index: number,
  x: number,
  y: number,
  z: number,
  size: number,
  bright: number,
  tint: [number, number, number],
  twinkle: number,
): void {
  data.positions[index * 3] = x;
  data.positions[index * 3 + 1] = y;
  data.positions[index * 3 + 2] = z;
  data.sizes[index] = size;
  data.brights[index] = bright;
  data.tints[index * 3] = tint[0];
  data.tints[index * 3 + 1] = tint[1];
  data.tints[index * 3 + 2] = tint[2];
  data.twinkles[index] = twinkle;
}

function buildField(count: number, xScale: number): IStarCloudData {
  const extra = CONSTELLATIONS.reduce((sum, item) => sum + item.stars.length, 0);
  const total = count + extra;
  const data: IStarCloudData = {
    positions: new Float32Array(total * 3),
    sizes: new Float32Array(total),
    brights: new Float32Array(total),
    tints: new Float32Array(total * 3),
    twinkles: new Float32Array(total),
  };
  const rand = seededRandom(41);
  for (let i = 0; i < count; i += 1) {
    const dir = sampleFieldDir(rand);
    const b = rand() ** 2.15;
    writeStar(
      data,
      i,
      dir[0] * CELESTIAL_RADIUS,
      dir[1] * CELESTIAL_RADIUS,
      dir[2] * CELESTIAL_RADIUS,
      1.6 + b * 4.4,
      0.4 + b * 0.72,
      pickStarTint(rand),
      rand() < 0.04 ? 1 : 0,
    );
  }
  let cursor = count;
  CONSTELLATIONS.forEach((item) => {
    const placement: ISkyPlacement =
      SKY_PLACEMENTS[item.id] ?? FALLBACK_SKY_PLACEMENT;
    item.stars.forEach((star) => {
      const pos = skyPoint(placement, star.x, star.y, xScale);
      writeStar(
        data,
        cursor,
        pos.x,
        pos.y,
        pos.z,
        3.4 + star.size * 1.6,
        0.92 + star.size * 0.12,
        pickStarTint(rand),
        0,
      );
      cursor += 1;
    });
  });
  return data;
}

export function FieldStars() {
  const quality = useQualityTier();
  const xScale = scaleForQuality(quality);
  const count = SKY_LAYER_COUNTS[quality].sphereField;
  const data = useMemo(
    () => buildField(count, xScale),
    [count, xScale],
  );
  return (
    <StarCloud
      data={data}
      attenuate={false}
      depthTest
      parallax={0}
      statKey="field"
    />
  );
}
