import { AdditiveBlending, DataTexture, ShaderMaterial } from "three";
import type { IStarShaderOptions } from "@/types/space";

const WHITE_MAP = new DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
WHITE_MAP.needsUpdate = true;

const STAR_VERT = `
attribute float aSize;
attribute float aBright;
attribute vec3 aTint;
attribute float aTwinkle;
uniform float uPixelRatio;
uniform float uTime;
uniform float uGlobal;
uniform float uAttenuate;
varying float vBright;
varying vec3 vTint;
void main() {
  float tw = 1.0 + aTwinkle * 0.06 * sin(uTime * 1.7 + position.x * 13.0);
  vBright = aBright * tw * uGlobal;
  vTint = aTint;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float atten = uAttenuate > 0.5 ? (12.0 / max(0.12, -mv.z)) : 1.0;
  gl_PointSize = aSize * uPixelRatio * atten;
  gl_Position = projectionMatrix * mv;
}
`;

const STAR_FRAG = `
uniform sampler2D uMap;
uniform float uUseMap;
varying float vBright;
varying vec3 vTint;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float r = length(p) * 2.0;
  float core = exp(-r * r * 16.0);
  float halo = exp(-r * r * 2.4) * 0.55;
  float glow = exp(-r * 1.05) * 0.16;
  float ax = abs(p.x);
  float ay = abs(p.y);
  float spike = (
    exp(-ay * 38.0) * exp(-ax * 2.6) +
    exp(-ax * 38.0) * exp(-ay * 2.6)
  ) * 0.72 * smoothstep(0.42, 0.82, vBright);
  float disc = (core + halo + glow + spike) * vBright;
  vec4 texel = texture2D(uMap, gl_PointCoord);
  float mapped = texel.a * vBright;
  float a = mix(disc, mapped, uUseMap);
  if (a < 0.003) discard;
  vec3 rgb = mix(vTint, vTint * texel.rgb, uUseMap);
  gl_FragColor = vec4(rgb * a, a);
}
`;

export function createStarMaterial({
  attenuate,
  depthTest,
  map,
}: IStarShaderOptions): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: 1 },
      uTime: { value: 0 },
      uGlobal: { value: 1 },
      uAttenuate: { value: attenuate ? 1 : 0 },
      uMap: { value: map ?? WHITE_MAP },
      uUseMap: { value: map ? 1 : 0 },
    },
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    transparent: true,
    depthWrite: false,
    depthTest,
    blending: AdditiveBlending,
    toneMapped: false,
  });
}
