"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Points,
  ShaderMaterial,
  Vector3,
} from "three";
import { SKY_LAYER_COUNTS, SKY_PLACEMENTS } from "@/data/sky";
import { CELESTIAL_RADIUS } from "@/data/sky";
import { bakeGalaxyAtlas } from "@/lib/bake-sky-maps";
import { enqueueIdle } from "@/lib/idle-work";
import {
  isInTextSafeCone,
  skyPoint,
  textSafeDestinations,
} from "@/lib/sky-placement";
import { skyStats } from "@/lib/sky-stats";
import { seededRandom } from "@/lib/utils";
import { scaleForQuality, useQualityTier } from "@/hooks/use-quality-tier";
import { useStarTexture } from "@/components/space/sky/star-cloud";
import type { IGalaxyCloudData, IGalaxyShaderOptions } from "@/types/space";

const GALAXY_VERT = `
attribute float aSize;
attribute float aAlpha;
attribute float aRotation;
attribute float aAtlas;
uniform float uPixelRatio;
varying float vAlpha;
varying float vRotation;
varying float vAtlas;
void main() {
  vAlpha = aAlpha;
  vRotation = aRotation;
  vAtlas = aAtlas;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio;
  gl_Position = projectionMatrix * mv;
}
`;

const GALAXY_FRAG = `
uniform sampler2D uMap;
varying float vAlpha;
varying float vRotation;
varying float vAtlas;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float s = sin(vRotation);
  float c = cos(vRotation);
  vec2 r = vec2(c * p.x - s * p.y, s * p.x + c * p.y) + 0.5;
  float col = mod(vAtlas, 2.0);
  float row = floor(vAtlas / 2.0);
  vec2 origin = vec2(col * 0.5, 1.0 - (row + 1.0) * 0.5);
  vec4 texel = texture2D(uMap, origin + r * 0.5);
  float a = texel.a * vAlpha;
  if (a < 0.004) discard;
  gl_FragColor = vec4(texel.rgb * a, a);
}
`;

function createGalaxyMaterial({ map }: IGalaxyShaderOptions): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: 1 },
      uMap: { value: map },
    },
    vertexShader: GALAXY_VERT,
    fragmentShader: GALAXY_FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: AdditiveBlending,
    toneMapped: false,
  });
}

const CLUSTER_OFFSETS: ReadonlyArray<[number, number, number, number, number]> = [
  [0, 0, 220, 0.08, 0],
  [-3.2, 2.1, 110, 0.18, 1],
  [4.1, -1.4, 90, 0.16, 1],
  [-1.8, -3.4, 70, 0.14, 2],
  [3.2, 3.1, 55, 0.12, 3],
];

const TILE_CYCLE = [0, 1, 1, 2, 3, 3, 0, 1, 2, 3, 3, 1];

function writeGalaxy(
  data: IGalaxyCloudData,
  index: number,
  point: Vector3,
  size: number,
  alpha: number,
  rotation: number,
  tile: number,
): void {
  data.positions[index * 3] = point.x;
  data.positions[index * 3 + 1] = point.y;
  data.positions[index * 3 + 2] = point.z;
  data.sizes[index] = size;
  data.alphas[index] = alpha;
  data.rotations[index] = rotation;
  data.atlas[index] = tile;
}

function scatterPoint(rand: () => number): Vector3 {
  const theta = rand() * Math.PI * 2;
  const polar = rand() < 0.72 ? 0.35 + rand() * 0.55 : rand();
  const sign = rand() < 0.5 ? 1 : -1;
  const phi = Math.acos(Math.max(-1, Math.min(1, polar * sign)));
  return new Vector3(
    Math.sin(phi) * Math.cos(theta) * CELESTIAL_RADIUS,
    Math.cos(phi) * CELESTIAL_RADIUS,
    Math.sin(phi) * Math.sin(theta) * CELESTIAL_RADIUS,
  );
}

function blocked(point: Vector3, alpha: number, xScale: number): boolean {
  if (alpha <= 0.12) {
    return false;
  }
  return textSafeDestinations().some((dest) =>
    isInTextSafeCone(point, dest, xScale),
  );
}

function buildGalaxies(count: number, xScale: number): IGalaxyCloudData {
  const data: IGalaxyCloudData = {
    positions: new Float32Array(count * 3),
    sizes: new Float32Array(count),
    alphas: new Float32Array(count),
    rotations: new Float32Array(count),
    atlas: new Float32Array(count),
  };
  const rand = seededRandom(17);
  const cluster = SKY_PLACEMENTS["galaxy-cluster"];
  let index = 0;
  CLUSTER_OFFSETS.forEach((offset) => {
    if (index >= count || !cluster) {
      return;
    }
    const point = skyPoint(cluster, offset[0], offset[1], xScale);
    if (blocked(point, offset[3], xScale)) {
      return;
    }
    writeGalaxy(data, index, point, offset[2], offset[3], rand() * 0.4, offset[4]);
    index += 1;
  });
  while (index < count) {
    let point = scatterPoint(rand);
    let alpha = 0.1 + rand() * 0.18;
    let tries = 0;
    while (blocked(point, alpha, xScale) && tries < 12) {
      point = scatterPoint(rand);
      alpha = 0.1 + rand() * 0.1;
      tries += 1;
    }
    if (!blocked(point, alpha, xScale)) {
      writeGalaxy(
        data,
        index,
        point,
        40 + rand() * 90,
        alpha,
        rand() * Math.PI,
        TILE_CYCLE[index] ?? 3,
      );
      index += 1;
    } else {
      break;
    }
  }
  if (index < count) {
    data.positions = data.positions.slice(0, index * 3);
    data.sizes = data.sizes.slice(0, index);
    data.alphas = data.alphas.slice(0, index);
    data.rotations = data.rotations.slice(0, index);
    data.atlas = data.atlas.slice(0, index);
  }
  return data;
}

export function GalaxyField() {
  const quality = useQualityTier();
  const xScale = scaleForQuality(quality);
  const [atlas, setAtlas] = useState<HTMLCanvasElement | null>(null);
  const points = useRef<Points>(null);
  const lastStat = useRef(0);
  const scratch = useMemo(() => new Vector3(), []);
  useEffect(() => {
    enqueueIdle(() => setAtlas(bakeGalaxyAtlas()));
  }, []);
  const map = useStarTexture(atlas);
  const data = useMemo(
    () => buildGalaxies(SKY_LAYER_COUNTS[quality].galaxies, xScale),
    [quality, xScale],
  );
  const material = useMemo(
    () => (map ? createGalaxyMaterial({ map }) : null),
    [map],
  );
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(data.positions, 3));
    geo.setAttribute("aSize", new BufferAttribute(data.sizes, 1));
    geo.setAttribute("aAlpha", new BufferAttribute(data.alphas, 1));
    geo.setAttribute("aRotation", new BufferAttribute(data.rotations, 1));
    geo.setAttribute("aAtlas", new BufferAttribute(data.atlas, 1));
    return geo;
  }, [data]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material?.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    const mat = points.current?.material;
    if (!(mat instanceof ShaderMaterial)) {
      return;
    }
    mat.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    const count = data.sizes.length;
    skyStats.galaxies = count;
    if (!points.current || state.clock.elapsedTime - lastStat.current < 0.5) {
      return;
    }
    lastStat.current = state.clock.elapsedTime;
    points.current.updateWorldMatrix(true, false);
    const step = Math.max(1, Math.floor(count / 12));
    let visible = 0;
    let sampled = 0;
    for (let i = 0; i < count; i += step) {
      scratch.fromArray(data.positions, i * 3);
      scratch.applyMatrix4(points.current.matrixWorld);
      scratch.project(state.camera);
      sampled += 1;
      if (
        scratch.z < 1 &&
        Math.abs(scratch.x) <= 1 &&
        Math.abs(scratch.y) <= 1
      ) {
        visible += 1;
      }
    }
    skyStats.galaxyVisible =
      sampled === 0 ? 0 : Math.round((visible / sampled) * count);
  });

  if (!material) {
    return null;
  }

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
