"use client";

import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { EllipseCurve, Vector3 } from "three";
import { CORE_POSITION, WORK_PLANET } from "@/data/space-config";
import { spaceRuntime } from "@/lib/space-runtime";

function ellipsePoints(
  radiusX: number,
  radiusZ: number,
  segments = 96,
): Vector3[] {
  const curve = new EllipseCurve(0, 0, radiusX, radiusZ, 0, Math.PI * 2, false, 0);
  return curve.getPoints(segments).map((point) => new Vector3(point.x, 0, point.y));
}

export function OrbitalPaths() {
  const coreOrbits = useMemo(
    () => [ellipsePoints(2.15, 1.55, 80), ellipsePoints(3.05, 1.95, 90)],
    [],
  );
  const workOrbits = useMemo(
    () => [ellipsePoints(1.85, 1.55), ellipsePoints(2.28, 1.82), ellipsePoints(2.72, 2.12)],
    [],
  );
  const hideExtra = spaceRuntime.quality === "mobile";
  const opacity = spaceRuntime.section === "contact" ? 0.05 : 0.18;

  return (
    <group>
      <group position={CORE_POSITION} rotation={[0.42, 0.2, -0.18]}>
        {coreOrbits.map((points, index) => (
          <Line
            key={`core-${index}`}
            points={points}
            color={index === 0 ? "#8aa8ff" : "#50cfe6"}
            transparent
            opacity={opacity * (index === 0 ? 1 : 0.65)}
            lineWidth={1}
          />
        ))}
      </group>
      {hideExtra ? null : (
        <group position={WORK_PLANET.position} rotation={[0.55, 0.1, 0.28]}>
          {workOrbits.map((points, index) => (
            <Line
              key={`work-${index}`}
              points={points}
              color="#6d8fff"
              transparent
              opacity={spaceRuntime.section === "work" ? 0.28 : 0.1}
              lineWidth={1}
            />
          ))}
        </group>
      )}
    </group>
  );
}
