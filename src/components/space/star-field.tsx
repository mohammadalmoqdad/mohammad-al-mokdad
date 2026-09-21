"use client";

import { useMemo } from "react";
import { SKY_LAYER_COUNTS } from "@/data/sky";
import { pickStarTint } from "@/lib/sky-placement";
import { seededRandom } from "@/lib/utils";
import { StarCloud } from "@/components/space/sky/star-cloud";
import type { IStarCloudData, IStarFieldProps, IStarLayerProps } from "@/types/space";

function buildDust(count: number, seed: number, spread: number): IStarCloudData {
  const data: IStarCloudData = {
    positions: new Float32Array(count * 3),
    sizes: new Float32Array(count),
    brights: new Float32Array(count),
    tints: new Float32Array(count * 3),
    twinkles: new Float32Array(count),
  };
  const rand = seededRandom(seed);
  for (let i = 0; i < count; i += 1) {
    const b = rand() ** 2.4;
    data.positions[i * 3] = (rand() - 0.5) * spread;
    data.positions[i * 3 + 1] = (rand() - 0.5) * spread * 0.45;
    data.positions[i * 3 + 2] = -6 - rand() * 52;
    data.sizes[i] = 1.7 + b * 3.2;
    data.brights[i] = 0.32 + b * 0.7;
    const tint = pickStarTint(rand);
    data.tints[i * 3] = tint[0];
    data.tints[i * 3 + 1] = tint[1];
    data.tints[i * 3 + 2] = tint[2];
    data.twinkles[i] = 0;
  }
  return data;
}

function DustLayer({
  count,
  seed,
  attenuate,
  parallax,
  depthTest,
}: IStarLayerProps) {
  const data = useMemo(
    () => buildDust(count, seed, seed === 19 ? 28 : 16),
    [count, seed],
  );
  return (
    <StarCloud
      data={data}
      attenuate={attenuate}
      depthTest={depthTest}
      parallax={parallax}
    />
  );
}

export function StarField({ quality }: IStarFieldProps) {
  const counts = SKY_LAYER_COUNTS[quality];
  return (
    <group name="corridor-dust">
      <DustLayer
        count={counts.corridorMid}
        seed={19}
        attenuate
        parallax={0.4}
        depthTest
      />
      {counts.corridorNear > 0 ? (
        <DustLayer
          count={counts.corridorNear}
          seed={47}
          attenuate
          parallax={0.9}
          depthTest
        />
      ) : null}
    </group>
  );
}
