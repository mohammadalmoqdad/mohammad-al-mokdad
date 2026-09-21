import { SKY_COOL, SKY_TINT, SKY_WARM } from "@/data/sky";
import { fbm } from "@/lib/value-noise";
import { hexToRgb } from "@/lib/utils";

function canvas(w: number, h: number): CanvasRenderingContext2D {
  const node = document.createElement("canvas");
  node.width = w;
  node.height = h;
  const ctx = node.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D is unavailable");
  }
  return ctx;
}

function tintRgb(kind: "warm" | "cool" | "neutral"): [number, number, number] {
  if (SKY_TINT <= 0 || kind === "neutral") {
    return [241, 241, 241];
  }
  return hexToRgb(kind === "warm" ? SKY_WARM : SKY_COOL);
}

export function bakeHeroSprite(): HTMLCanvasElement {
  const size = 128;
  const ctx = canvas(size, size);
  const image = ctx.createImageData(size, size);
  const cx = (size - 1) / 2;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x - cx;
      const dy = y - cx;
      const r = Math.hypot(dx, dy);
      const core = Math.exp(-((r / 5.2) * (r / 5.2)));
      const halo = Math.exp(-((r / 26) * (r / 26))) * 0.42;
      const glow = Math.exp(-r / 38) * 0.12;
      const spikeX = (1 / (1 + Math.abs(dy) * 0.28)) * Math.exp(-((dx / 1.15) ** 2));
      const spikeY = (1 / (1 + Math.abs(dx) * 0.28)) * Math.exp(-((dy / 1.15) ** 2));
      const d45 = Math.abs(dx) + Math.abs(dy);
      const spike45 =
        (1 / (1 + d45 * 0.18)) * Math.exp(-(((dx - dy) / 2.0) ** 2)) * 0.32;
      const a = Math.min(
        1,
        core + halo + glow + spikeX * 0.82 + spikeY * 0.82 + spike45,
      );
      const i = (y * size + x) * 4;
      image.data[i] = 255;
      image.data[i + 1] = 255;
      image.data[i + 2] = 255;
      image.data[i + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(image, 0, 0);
  return ctx.canvas;
}

function paintElliptical(data: Uint8ClampedArray, size: number, ox: number, oy: number): void {
  const [tr, tg, tb] = tintRgb("warm");
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x / size - 0.5) * 2;
      const ny = (y / size - 0.5) * 2;
      const a = Math.exp(-((nx * nx + (ny * ny) / (0.65 * 0.65)) ** 0.7));
      const i = ((oy + y) * (size * 2) + (ox + x)) * 4;
      data[i] = tr;
      data[i + 1] = tg;
      data[i + 2] = tb;
      data[i + 3] = Math.round(a * 220);
    }
  }
}

function paintEdgeOn(data: Uint8ClampedArray, size: number, ox: number, oy: number): void {
  const [tr, tg, tb] = tintRgb("cool");
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x / size - 0.5) * 2;
      const ny = (y / size - 0.5) * 2;
      const disc = Math.exp(-(nx * nx * 0.7 + (ny * ny) / (0.06 * 0.06)));
      const bulge = Math.exp(-(nx * nx * 8 + ny * ny * 8)) * 0.55;
      const lane = Math.exp(-(nx * nx * 0.5 + (ny * ny) / (0.02 * 0.02))) * 0.4;
      const a = Math.max(0, disc + bulge - lane);
      const i = ((oy + y) * (size * 2) + (ox + x)) * 4;
      data[i] = tr;
      data[i + 1] = tg;
      data[i + 2] = tb;
      data[i + 3] = Math.round(Math.min(1, a) * 200);
    }
  }
}

function paintSpiral(data: Uint8ClampedArray, size: number, ox: number, oy: number): void {
  const [tr, tg, tb] = tintRgb("warm");
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x / size - 0.5) * 2;
      const ny = (y / size - 0.5) * 2;
      const r = Math.hypot(nx, ny);
      const theta = Math.atan2(ny, nx);
      const arm = Math.exp(-((theta - Math.log(r * 8 + 0.12) * 0.55) ** 2) * 3);
      const arm2 = Math.exp(-((theta + Math.PI - Math.log(r * 8 + 0.12) * 0.55) ** 2) * 3);
      const noise = fbm(x * 0.04, y * 0.04, 3, 32);
      const bulge = Math.exp(-(r * r) * 6);
      const a = Math.min(1, bulge * 0.7 + (arm + arm2) * 0.35 * noise);
      const i = ((oy + y) * (size * 2) + (ox + x)) * 4;
      data[i] = tr;
      data[i + 1] = tg;
      data[i + 2] = tb;
      data[i + 3] = Math.round(a * 180);
    }
  }
}

function paintSmudge(data: Uint8ClampedArray, size: number, ox: number, oy: number): void {
  const [tr, tg, tb] = tintRgb("neutral");
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x / size - 0.5) * 2;
      const ny = (y / size - 0.5) * 2;
      const a = Math.exp(-(nx * nx * 3.2 + ny * ny * 5.5)) * 0.4;
      const i = ((oy + y) * (size * 2) + (ox + x)) * 4;
      data[i] = tr;
      data[i + 1] = tg;
      data[i + 2] = tb;
      data[i + 3] = Math.round(a * 255);
    }
  }
}

export function bakeGalaxyAtlas(): HTMLCanvasElement {
  const tile = 256;
  const ctx = canvas(tile * 2, tile * 2);
  const image = ctx.createImageData(tile * 2, tile * 2);
  paintElliptical(image.data, tile, 0, 0);
  paintEdgeOn(image.data, tile, tile, 0);
  paintSpiral(image.data, tile, 0, tile);
  paintSmudge(image.data, tile, tile, tile);
  ctx.putImageData(image, 0, 0);
  return ctx.canvas;
}

export function bakeDeepHaze(quality: "high" | "medium"): HTMLCanvasElement {
  const w = quality === "high" ? 1024 : 512;
  const h = quality === "high" ? 512 : 256;
  const ctx = canvas(w, h);
  const image = ctx.createImageData(w, h);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const u = x / w;
      const v = y / h;
      const large = fbm(u * 4, v * 2, 4, 8);
      const band = Math.exp(-((v - (0.5 + 0.18 * Math.sin(u * Math.PI * 2))) ** 2) * 18);
      const lane = fbm(u * 18, v * 6, 3, 32);
      const a = Math.max(0, large * 0.45 + band * 0.55 - lane * 0.22);
      const i = (y * w + x) * 4;
      image.data[i] = 208;
      image.data[i + 1] = 208;
      image.data[i + 2] = 208;
      image.data[i + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(image, 0, 0);
  return ctx.canvas;
}
