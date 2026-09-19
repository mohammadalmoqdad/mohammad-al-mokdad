"use client";

import { SECTION_STATES } from "@/data/space-config";
import { spaceRuntime } from "@/lib/space-runtime";

export function AmbientLights() {
  const ambient = SECTION_STATES[spaceRuntime.section].ambientColor;

  return (
    <>
      <color attach="background" args={["#070a0f"]} />
      <ambientLight color={ambient} intensity={0.42} />
      <hemisphereLight args={["#9bb6ff", "#070a0f", 0.35]} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={0.85}
        color="#d7e3ff"
      />
      <pointLight
        position={[-6, -2, 4]}
        intensity={0.35}
        color="#50cfe6"
        distance={28}
      />
    </>
  );
}
