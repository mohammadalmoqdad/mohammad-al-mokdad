import type { IPlanetCompileShader } from "@/types/space";

export function patchPlanetMaterial(
  shader: IPlanetCompileShader,
  rim: [number, number, number],
  ringShadow: boolean,
): void {
  const r = (rim[0] / 255).toFixed(3);
  const g = (rim[1] / 255).toFixed(3);
  const b = (rim[2] / 255).toFixed(3);
  const form = `
    vec3 viewN = normalize(normal);
    vec3 viewV = normalize(vViewPosition);
    float ndv = abs(dot(viewN, viewV));
    float fres = pow(1.0 - ndv, 3.0);
    outgoingLight *= 0.72 + 0.28 * ndv;
    outgoingLight += vec3(${r}, ${g}, ${b}) * fres * 0.1;
  `;
  const shadow = ringShadow
    ? `
    #ifdef USE_MAP
    float ringLat = vMapUv.y * 2.0 - 1.0;
    outgoingLight *= 1.0 - 0.55 * (1.0 - smoothstep(0.03, 0.05, abs(ringLat)));
    #endif
    `
    : "";
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <opaque_fragment>",
    `${form}\n${shadow}\n#include <opaque_fragment>`,
  );
}
