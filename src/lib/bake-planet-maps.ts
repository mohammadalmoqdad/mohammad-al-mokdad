import { fbm } from "@/lib/value-noise";
import { seededRandom } from "@/lib/utils";
import type { IPlanetSurfaceMaps, TPlanetId, TSpaceQuality } from "@/types/space";

type TRgb = [number, number, number];

export const planetBakeMetrics = {
  jupiterBandContrast: 0,
};

const PERIOD = 256;

function noiseAt(
  u: number,
  v: number,
  octaves: number,
  fu: number,
  fv: number,
): number {
  return fbm(u * PERIOD * fu, v * PERIOD * fv, octaves, PERIOD * fu);
}

function mix(a: TRgb, b: TRgb, t: number): TRgb {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function wrapDelta(u: number, cu: number): number {
  let delta = u - cu;
  if (delta > 0.5) {
    delta -= 1;
  } else if (delta < -0.5) {
    delta += 1;
  }
  return delta;
}

function ellipseField(
  u: number,
  v: number,
  cu: number,
  cv: number,
  ru: number,
  rv: number,
): number {
  return clamp01(1 - Math.hypot(wrapDelta(u, cu) / ru, (v - cv) / rv));
}

function sizeFor(quality: TSpaceQuality): { w: number; h: number } {
  if (quality === "high") {
    return { w: 1024, h: 512 };
  }
  if (quality === "medium") {
    return { w: 768, h: 384 };
  }
  return { w: 512, h: 256 };
}

function canvas(w: number, h: number): CanvasRenderingContext2D {
  const node = document.createElement("canvas");
  node.width = w;
  node.height = h;
  const ctx = node.getContext("2d", { willReadFrequently: false });
  if (!ctx) {
    throw new Error("Canvas 2D is unavailable");
  }
  return ctx;
}

function putRgba(
  data: Uint8ClampedArray,
  index: number,
  rgb: TRgb,
  alpha = 255,
): void {
  data[index] = Math.max(0, Math.min(255, rgb[0]));
  data[index + 1] = Math.max(0, Math.min(255, rgb[1]));
  data[index + 2] = Math.max(0, Math.min(255, rgb[2]));
  data[index + 3] = alpha;
}

function encodeMaps(
  w: number,
  h: number,
  albedo: Uint8ClampedArray,
  height: Float32Array,
  roughness: Uint8ClampedArray,
  strength: number,
): IPlanetSurfaceMaps {
  let minH = Infinity;
  let maxH = -Infinity;
  for (let i = 0; i < height.length; i += 1) {
    const value = height[i] ?? 0;
    if (value < minH) {
      minH = value;
    }
    if (value > maxH) {
      maxH = value;
    }
  }
  const span = Math.max(0.0001, maxH - minH);
  const normal = new Uint8ClampedArray(w * h * 4);
  const bump = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y += 1) {
    const up = Math.max(0, y - 1);
    const down = Math.min(h - 1, y + 1);
    for (let x = 0; x < w; x += 1) {
      const left = x === 0 ? w - 1 : x - 1;
      const right = x === w - 1 ? 0 : x + 1;
      const nx = (height[y * w + left] - height[y * w + right]) * strength;
      const ny = (height[up * w + x] - height[down * w + x]) * strength;
      const len = Math.hypot(nx, ny, 1) || 1;
      const i = (y * w + x) * 4;
      normal[i] = ((nx / len) * 0.5 + 0.5) * 255;
      normal[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      normal[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      normal[i + 3] = 255;
      const g = ((height[y * w + x] - minH) / span) * 255;
      bump[i] = g;
      bump[i + 1] = g;
      bump[i + 2] = g;
      bump[i + 3] = 255;
    }
  }
  const colorCtx = canvas(w, h);
  const colorImage = colorCtx.createImageData(w, h);
  colorImage.data.set(albedo);
  colorCtx.putImageData(colorImage, 0, 0);
  const normalCtx = canvas(w, h);
  const normalImage = normalCtx.createImageData(w, h);
  normalImage.data.set(normal);
  normalCtx.putImageData(normalImage, 0, 0);
  const roughCtx = canvas(w, h);
  const roughImage = roughCtx.createImageData(w, h);
  roughImage.data.set(roughness);
  roughCtx.putImageData(roughImage, 0, 0);
  const bumpCtx = canvas(w, h);
  const bumpImage = bumpCtx.createImageData(w, h);
  bumpImage.data.set(bump);
  bumpCtx.putImageData(bumpImage, 0, 0);
  return {
    albedo: colorCtx.canvas,
    normal: normalCtx.canvas,
    roughness: roughCtx.canvas,
    bump: bumpCtx.canvas,
  };
}

function craterAt(
  u: number,
  v: number,
  cu: number,
  cv: number,
  radius: number,
  depth: number,
): { height: number; shade: number; rim: number } {
  let du = u - cu;
  if (du > 0.5) {
    du -= 1;
  } else if (du < -0.5) {
    du += 1;
  }
  const dist = Math.hypot(du * 2, v - cv);
  if (dist >= radius) {
    return { height: 0, shade: 0, rim: 0 };
  }
  const t = dist / radius;
  if (t >= 0.82) {
    const rim = 1 - Math.abs(t - 0.91) / 0.09;
    return { height: rim * 0.45 * depth, shade: rim * 0.28, rim };
  }
  const bowl = (1 - t * t) * depth;
  return { height: -bowl, shade: -bowl * 1.15, rim: 0 };
}

function bakeJupiter(quality: TSpaceQuality): IPlanetSurfaceMaps {
  const { w, h } = sizeFor(quality);
  const albedo = new Uint8ClampedArray(w * h * 4);
  const height = new Float32Array(w * h);
  const roughness = new Uint8ClampedArray(w * h * 4);
  const pale: TRgb = [176, 160, 136];
  const belt: TRgb = [96, 80, 64];
  const storm: TRgb = [132, 96, 72];
  let zoneSum = 0;
  let beltSum = 0;
  let zoneCount = 0;
  let beltCount = 0;
  for (let y = 0; y < h; y += 1) {
    const v = y / h;
    for (let x = 0; x < w; x += 1) {
      const u = x / w;
      const warp = noiseAt(u, v, 3, 3, 8);
      const lat = v + (warp - 0.5) * 0.028;
      const wave = 0.5 + 0.5 * Math.sin(lat * Math.PI * 7);
      const even = wave > 0.5;
      let lum = 0.4 + wave * 0.26 + (warp - 0.5) * 0.05;
      const oval = Math.exp(-((u - 0.63) ** 2 * 95 + (v - 0.4) ** 2 * 280));
      lum = clamp01(lum - oval * 0.1);
      let color = mix(belt, pale, lum);
      color = mix(color, storm, oval * 0.38);
      if (even) {
        zoneSum += lum;
        zoneCount += 1;
      } else {
        beltSum += lum;
        beltCount += 1;
      }
      const i = (y * w + x) * 4;
      putRgba(albedo, i, color);
      height[y * w + x] = wave * 0.06 + oval * 0.04;
      putRgba(roughness, i, [148, 148, 148]);
    }
  }
  planetBakeMetrics.jupiterBandContrast =
    zoneCount && beltCount ? zoneSum / zoneCount - beltSum / beltCount : 0;
  return encodeMaps(w, h, albedo, height, roughness, 1.4);
}

function bakeSaturn(quality: TSpaceQuality): IPlanetSurfaceMaps {
  const { w, h } = sizeFor(quality);
  const albedo = new Uint8ClampedArray(w * h * 4);
  const height = new Float32Array(w * h);
  const roughness = new Uint8ClampedArray(w * h * 4);
  const pale: TRgb = [188, 172, 142];
  const dark: TRgb = [108, 92, 70];
  for (let y = 0; y < h; y += 1) {
    const v = y / h;
    for (let x = 0; x < w; x += 1) {
      const u = x / w;
      const flow = noiseAt(u, v, 3, 3, 10);
      const wave = 0.5 + 0.5 * Math.sin((v + (flow - 0.5) * 0.018) * Math.PI * 8);
      const lum = clamp01(0.42 + wave * 0.2 + (flow - 0.5) * 0.04);
      const color = mix(dark, pale, lum);
      const i = (y * w + x) * 4;
      putRgba(albedo, i, color);
      height[y * w + x] = wave * 0.05;
      putRgba(roughness, i, [140, 140, 140]);
    }
  }
  return encodeMaps(w, h, albedo, height, roughness, 1.2);
}

export function bakeSaturnRings(quality: TSpaceQuality): HTMLCanvasElement {
  const w = quality === "high" ? 2048 : 1024;
  const ctx = canvas(w, 16);
  for (let x = 0; x < w; x += 1) {
    const u = x / w;
    let alpha = 0.85;
    let shade = 168;
    if (u < 0.22) {
      alpha = 0.35;
      shade = 110;
    } else if (u < 0.55) {
      alpha = 0.72;
      shade = 148;
    } else if (u < 0.78) {
      alpha = 0.88;
      shade = 190;
    }
    if (Math.abs(u - 0.72) < 0.012) {
      alpha = 0.05;
    }
    if (Math.abs(u - 0.94) < 0.006) {
      alpha = 0.32;
    }
    const groove = fbm(u * 400, 0.2, 3, 400);
    alpha = clamp01(alpha + (groove - 0.5) * 0.08);
    shade += (groove - 0.5) * 28;
    ctx.fillStyle = `rgba(${shade},${shade * 0.96},${shade * 0.86},${alpha})`;
    ctx.fillRect(x, 0, 1, 16);
  }
  return ctx.canvas;
}

function marsCraters(): Array<[number, number, number, number]> {
  return [
    [0.28, 0.36, 0.028, 0.4],
    [0.62, 0.48, 0.022, 0.35],
    [0.44, 0.58, 0.018, 0.3],
    [0.78, 0.32, 0.016, 0.28],
    [0.18, 0.62, 0.02, 0.32],
  ];
}

function bakeMars(quality: TSpaceQuality): IPlanetSurfaceMaps {
  const { w, h } = sizeFor(quality);
  const albedo = new Uint8ClampedArray(w * h * 4);
  const height = new Float32Array(w * h);
  const roughness = new Uint8ClampedArray(w * h * 4);
  const rust: TRgb = [148, 86, 58];
  const dust: TRgb = [168, 118, 86];
  const ice: TRgb = [196, 192, 186];
  const craters = marsCraters();
  for (let y = 0; y < h; y += 1) {
    const v = y / h;
    for (let x = 0; x < w; x += 1) {
      const u = x / w;
      const terrain = noiseAt(u, v, 4, 4, 4);
      let elevation = 0.42 + (terrain - 0.5) * 0.18;
      let shade = (terrain - 0.5) * 0.16;
      craters.forEach((crater) => {
        const hit = craterAt(u, v, crater[0], crater[1], crater[2], crater[3]);
        elevation += hit.height * 0.45;
        shade += hit.shade * 0.22;
      });
      let color = mix(rust, dust, clamp01(0.45 + shade));
      if (v < 0.07 || v > 0.93) {
        color = mix(color, ice, 0.72);
        elevation += 0.06;
      }
      const i = (y * w + x) * 4;
      putRgba(albedo, i, color);
      height[y * w + x] = elevation;
      putRgba(roughness, i, [188, 188, 188]);
    }
  }
  return encodeMaps(w, h, albedo, height, roughness, 2.4);
}

function bakeNeptune(quality: TSpaceQuality): IPlanetSurfaceMaps {
  const { w, h } = sizeFor(quality);
  const albedo = new Uint8ClampedArray(w * h * 4);
  const height = new Float32Array(w * h);
  const roughness = new Uint8ClampedArray(w * h * 4);
  const deep: TRgb = [28, 38, 52];
  const mid: TRgb = [62, 78, 98];
  const cloud: TRgb = [154, 168, 184];
  const storm: TRgb = [14, 18, 26];
  for (let y = 0; y < h; y += 1) {
    const v = y / h;
    for (let x = 0; x < w; x += 1) {
      const u = x / w;
      const flow = noiseAt(u, v, 3, 4, 12);
      const lat = v + (flow - 0.5) * 0.04;
      const wave = 0.5 + 0.5 * Math.sin(lat * Math.PI * 5);
      let lum = 0.32 + wave * 0.18 + (flow - 0.5) * 0.08;
      const dx = wrapDelta(u, 0.38) / 0.11;
      const dy = (v - 0.6) / 0.055;
      const oval = Math.exp(-(dx * dx + dy * dy));
      const swirl = 0.5 + 0.5 * Math.sin(Math.atan2(dy, dx) * 3 + oval * 6);
      lum -= oval * 0.22;
      const streak = noiseAt(u * 0.55 + v * 0.2, v, 2, 22, 3);
      if (streak > 0.56) {
        lum += (streak - 0.56) * 0.55;
      }
      lum = clamp01(lum + (v < 0.12 || v > 0.88 ? 0.08 : 0));
      let color = mix(deep, mid, lum);
      color = mix(color, storm, oval * 0.82);
      color = mix(color, cloud, clamp01((lum - 0.58) * 1.8 + swirl * oval * 0.2));
      const i = (y * w + x) * 4;
      putRgba(albedo, i, color);
      height[y * w + x] = wave * 0.04 + oval * 0.05;
      putRgba(roughness, i, [72, 72, 72]);
    }
  }
  return encodeMaps(w, h, albedo, height, roughness, 1.1);
}

const EARTH_LAND: ReadonlyArray<[number, number, number, number]> = [
  [0.22, 0.34, 0.11, 0.12],
  [0.18, 0.26, 0.07, 0.07],
  [0.3, 0.62, 0.055, 0.16],
  [0.52, 0.5, 0.07, 0.15],
  [0.54, 0.4, 0.05, 0.08],
  [0.5, 0.34, 0.06, 0.055],
  [0.68, 0.36, 0.15, 0.1],
  [0.78, 0.4, 0.09, 0.07],
  [0.66, 0.48, 0.04, 0.06],
  [0.82, 0.66, 0.055, 0.04],
  [0.38, 0.16, 0.04, 0.05],
  [0.72, 0.52, 0.02, 0.05],
];

function earthLand(u: number, v: number): number {
  let land = 0;
  EARTH_LAND.forEach(([cu, cv, ru, rv]) => {
    land = Math.max(land, ellipseField(u, v, cu, cv, ru, rv));
  });
  return land;
}

function bakeEarth(quality: TSpaceQuality): IPlanetSurfaceMaps {
  const { w, h } = sizeFor(quality);
  const albedo = new Uint8ClampedArray(w * h * 4);
  const height = new Float32Array(w * h);
  const roughness = new Uint8ClampedArray(w * h * 4);
  const ocean: TRgb = [18, 30, 46];
  const shelf: TRgb = [32, 50, 68];
  const land: TRgb = [92, 96, 80];
  const highland: TRgb = [124, 114, 90];
  const ice: TRgb = [198, 204, 212];
  for (let y = 0; y < h; y += 1) {
    const v = y / h;
    const lat = (0.5 - v) * 180;
    for (let x = 0; x < w; x += 1) {
      const u = x / w;
      const coast = noiseAt(u, v, 4, 8, 8);
      const terrain = noiseAt(u, v, 3, 10, 10);
      const field = earthLand(u, v) + (coast - 0.5) * 0.2;
      const isLand = field > 0.34;
      let color: TRgb;
      let elevation: number;
      let rough: number;
      if (Math.abs(lat) > 68 || (field > 0.3 && v < 0.2 && u > 0.32 && u < 0.44)) {
        color = ice;
        elevation = 0.48 + terrain * 0.08;
        rough = 200;
      } else if (isLand) {
        color = mix(land, highland, clamp01((terrain - 0.4) * 1.6));
        elevation = 0.4 + field * 0.35 + terrain * 0.12;
        rough = 196;
      } else {
        color = mix(ocean, shelf, clamp01((field - 0.18) * 3));
        elevation = 0.05 + field * 0.08;
        rough = 42;
      }
      const i = (y * w + x) * 4;
      putRgba(albedo, i, color);
      height[y * w + x] = elevation;
      putRgba(roughness, i, [rough, rough, rough]);
    }
  }
  return encodeMaps(w, h, albedo, height, roughness, 4.2);
}

export function bakeEarthClouds(quality: TSpaceQuality): HTMLCanvasElement {
  const { w, h } = sizeFor(quality);
  const ctx = canvas(w, h);
  const image = ctx.createImageData(w, h);
  const octaves = quality === "low" ? 3 : 5;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const u = x / w;
      const v = y / h;
      const cloud = noiseAt(u, v, octaves, 6, 6);
      const t = clamp01((cloud - 0.54) / 0.2);
      const i = (y * w + x) * 4;
      image.data[i] = 220;
      image.data[i + 1] = 224;
      image.data[i + 2] = 230;
      image.data[i + 3] = t * 0.58 * 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return ctx.canvas;
}

const MARIA: ReadonlyArray<[number, number, number, number]> = [
  [0.32, 0.42, 0.16, 0.55],
  [0.48, 0.38, 0.12, 0.48],
  [0.62, 0.52, 0.14, 0.5],
  [0.22, 0.58, 0.09, 0.4],
  [0.72, 0.34, 0.08, 0.36],
];

function lunaCraters(count: number): Array<[number, number, number, number]> {
  const rand = seededRandom(17);
  const list: Array<[number, number, number, number]> = [
    [0.18, 0.28, 0.09, 0.9],
    [0.78, 0.62, 0.07, 0.75],
    [0.54, 0.22, 0.055, 0.65],
  ];
  for (let i = 0; i < count; i += 1) {
    list.push([rand(), 0.08 + rand() * 0.84, 0.012 + rand() * 0.04, 0.35 + rand() * 0.45]);
  }
  return list;
}

function bakeLuna(quality: TSpaceQuality): IPlanetSurfaceMaps {
  const { w, h } = sizeFor(quality);
  const albedo = new Uint8ClampedArray(w * h * 4);
  const height = new Float32Array(w * h);
  const roughness = new Uint8ClampedArray(w * h * 4);
  const highland: TRgb = [196, 192, 184];
  const mare: TRgb = [48, 46, 44];
  const rim: TRgb = [232, 228, 220];
  const floor: TRgb = [28, 26, 24];
  const craters = lunaCraters(quality === "low" ? 28 : 70);
  for (let y = 0; y < h; y += 1) {
    const v = y / h;
    for (let x = 0; x < w; x += 1) {
      const u = x / w;
      const grain = noiseAt(u, v, 6, 8, 8);
      let lum = 0.58 + (grain - 0.5) * 0.22;
      let elevation = grain * 0.35;
      MARIA.forEach(([cu, cv, radius, depth]) => {
        let du = u - cu;
        if (du > 0.5) {
          du -= 1;
        } else if (du < -0.5) {
          du += 1;
        }
        const d = Math.hypot(du * 1.6, v - cv) / radius;
        if (d < 1) {
          lum -= (1 - d) * depth * 0.7;
          elevation -= (1 - d) * 0.35;
        }
      });
      let ejecta = 0;
      craters.forEach((crater, index) => {
        const hit = craterAt(u, v, crater[0], crater[1], crater[2], crater[3]);
        elevation += hit.height;
        lum += hit.shade * 0.55;
        if (hit.rim > 0.4) {
          lum += hit.rim * 0.18;
        }
        if (index < 3) {
          let du = u - crater[0];
          if (du > 0.5) {
            du -= 1;
          } else if (du < -0.5) {
            du += 1;
          }
          const ang = Math.atan2(v - crater[1], du);
          const dist = Math.hypot(du * 2, v - crater[1]);
          const reach = crater[2] * 3.4;
          if (dist < reach && dist > crater[2] * 0.9) {
            const ray = Math.max(0, Math.cos(ang * 7) ) ** 8;
            ejecta += ray * (1 - dist / reach) * 0.22;
          }
        }
      });
      lum = clamp01(lum + ejecta);
      let color = mix(mare, highland, lum);
      if (lum < 0.28) {
        color = mix(color, floor, 0.55);
      }
      if (lum > 0.72) {
        color = mix(color, rim, 0.4);
      }
      const i = (y * w + x) * 4;
      putRgba(albedo, i, color);
      height[y * w + x] = elevation;
      const rough = 210 - lum * 30;
      putRgba(roughness, i, [rough, rough, rough]);
    }
  }
  return encodeMaps(w, h, albedo, height, roughness, quality === "low" ? 8 : 12);
}

const surfaceCache = new Map<string, IPlanetSurfaceMaps>();
const moonCache = new Map<TSpaceQuality, IPlanetSurfaceMaps>();

export function bakeMoonSurfaces(quality: TSpaceQuality): IPlanetSurfaceMaps {
  const cachedMoon = moonCache.get(quality);
  if (cachedMoon) {
    return cachedMoon;
  }
  const maps = bakeLuna(quality === "high" ? "medium" : "low");
  moonCache.set(quality, maps);
  return maps;
}

export function bakePlanetSurfaces(
  planet: TPlanetId,
  quality: TSpaceQuality,
): IPlanetSurfaceMaps | null {
  const key = `v5-${planet}-${quality}`;
  const cached = surfaceCache.get(key);
  if (cached) {
    return cached;
  }
  let maps: IPlanetSurfaceMaps | null = null;
  switch (planet) {
    case "jupiter":
      maps = bakeJupiter(quality);
      break;
    case "saturn":
      maps = bakeSaturn(quality);
      break;
    case "mars":
      maps = bakeMars(quality);
      break;
    case "neptune":
      maps = bakeNeptune(quality);
      break;
    case "earth":
      maps = bakeEarth(quality);
      break;
    case "luna":
      maps = bakeLuna(quality);
      break;
    default:
      maps = null;
  }
  if (maps) {
    surfaceCache.set(key, maps);
  }
  return maps;
}

export function planetMapLabel(quality: TSpaceQuality): string {
  const { w, h } = sizeFor(quality);
  return `${w}x${h}`;
}

export function visualPlanetId(_destinationId: string, planet: TPlanetId): TPlanetId {
  return planet;
}
