"use client";

import { useEffect, useMemo, useState } from "react";
import { Vector3 } from "three";
import {
  CONSTELLATIONS,
  FALLBACK_SKY_PLACEMENT,
  HERO_STAR_IDS,
  HERO_STAR_PX,
  SKY_LAYER_COUNTS,
  SKY_PLACEMENTS,
} from "@/data/sky";
import { CELESTIAL_RADIUS } from "@/data/sky";
import { bakeHeroSprite } from "@/lib/bake-sky-maps";
import { enqueueIdle } from "@/lib/idle-work";
import {
  isInTextSafeCone,
  pickStarTint,
  skyPoint,
  textSafeDestinations,
} from "@/lib/sky-placement";
import { seededRandom } from "@/lib/utils";
import { scaleForQuality, useQualityTier } from "@/hooks/use-quality-tier";
import { StarCloud, useStarTexture } from "@/components/space/sky/star-cloud";
import type { ISkyPlacement, IStarCloudData } from "@/types/space";

function namedPoint(
  id: string,
  xScale: number,
): Vector3 | null {
  if (id === "polaris") {
    return skyPoint(SKY_PLACEMENTS.polaris ?? FALLBACK_SKY_PLACEMENT, 0, 0, xScale);
  }
  if (id === "vega") {
    return skyPoint(SKY_PLACEMENTS.vega ?? FALLBACK_SKY_PLACEMENT, 0, 0, xScale);
  }
  if (id === "polaris-return") {
    return skyPoint(
      SKY_PLACEMENTS["polaris-return"] ?? FALLBACK_SKY_PLACEMENT,
      0,
      0,
      xScale,
    );
  }
  for (const item of CONSTELLATIONS) {
    const star = item.stars.find((entry) => entry.id === id);
    const placement: ISkyPlacement | undefined = SKY_PLACEMENTS[item.id];
    if (star && placement) {
      return skyPoint(placement, star.x, star.y, xScale);
    }
  }
  return null;
}

function heroBright(point: Vector3, xScale: number, fallback: number): number {
  const dests = textSafeDestinations();
  for (const dest of dests) {
    if (isInTextSafeCone(point, dest, xScale)) {
      return fallback * 0.72;
    }
  }
  return fallback;
}

function writeHero(
  data: IStarCloudData,
  index: number,
  point: Vector3,
  size: number,
  bright: number,
  tint: [number, number, number],
): void {
  data.positions[index * 3] = point.x;
  data.positions[index * 3 + 1] = point.y;
  data.positions[index * 3 + 2] = point.z;
  data.sizes[index] = size;
  data.brights[index] = bright;
  data.tints[index * 3] = tint[0];
  data.tints[index * 3 + 1] = tint[1];
  data.tints[index * 3 + 2] = tint[2];
  data.twinkles[index] = 1;
}

function buildHero(count: number, xScale: number): IStarCloudData {
  const data: IStarCloudData = {
    positions: new Float32Array(count * 3),
    sizes: new Float32Array(count),
    brights: new Float32Array(count),
    tints: new Float32Array(count * 3),
    twinkles: new Float32Array(count),
  };
  const rand = seededRandom(73);
  const named = [...HERO_STAR_IDS, "polaris-return"];
  let index = 0;
  named.forEach((id) => {
    if (index >= count) {
      return;
    }
    const point = namedPoint(id, xScale);
    if (!point) {
      return;
    }
    const base = id === "polaris-return" ? 0.4 : 1;
    writeHero(
      data,
      index,
      point,
      HERO_STAR_PX[id] ?? (id === "polaris-return" ? 16 : 14),
      heroBright(point, xScale, base),
      pickStarTint(rand),
    );
    index += 1;
  });
  const spare = new Vector3();
  while (index < count) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    spare.set(
      Math.sin(phi) * Math.cos(theta) * CELESTIAL_RADIUS,
      Math.cos(phi) * CELESTIAL_RADIUS,
      Math.sin(phi) * Math.sin(theta) * CELESTIAL_RADIUS,
    );
    writeHero(
      data,
      index,
      spare,
      24 + rand() * 22,
      heroBright(spare, xScale, 0.7 + rand() * 0.3),
      pickStarTint(rand),
    );
    index += 1;
  }
  return data;
}

export function HeroStars() {
  const quality = useQualityTier();
  const xScale = scaleForQuality(quality);
  const [sprite, setSprite] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
    enqueueIdle(() => setSprite(bakeHeroSprite()));
  }, []);
  const map = useStarTexture(sprite);
  const data = useMemo(
    () => buildHero(SKY_LAYER_COUNTS[quality].heroStars, xScale),
    [quality, xScale],
  );
  if (!map) {
    return null;
  }
  return (
    <StarCloud
      data={data}
      attenuate={false}
      depthTest
      map={map}
      parallax={0}
      statKey="hero"
    />
  );
}
