function hash2(ix: number, iy: number, period: number): number {
  const x = ((ix % period) + period) % period;
  let h = (x * 374761393 + iy * 668265263) ^ 0x5bd1e995;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export function valueNoise(x: number, y: number, period: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy, period);
  const b = hash2(ix + 1, iy, period);
  const c = hash2(ix, iy + 1, period);
  const d = hash2(ix + 1, iy + 1, period);
  return a + (b - a) * sx + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
}

export function fbm(
  x: number,
  y: number,
  octaves: number,
  period: number,
): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i += 1) {
    value += amp * valueNoise(x * freq, y * freq, Math.max(1, period * freq));
    amp *= 0.5;
    freq *= 2;
  }
  return value;
}
