"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh } from "three";
import { DESTINATIONS } from "@/data/journey";
import { MONO } from "@/data/mono-palette";
import { journey } from "@/lib/journey-store";
import type { IEngineeringCoreProps } from "@/types/space";

export function EngineeringCore({ xScale }: IEngineeringCoreProps) {
  const group = useRef<Group>(null);
  const inner = useRef<Mesh>(null);
  const ringA = useRef<Mesh>(null);
  const ringB = useRef<Mesh>(null);
  const dest = DESTINATIONS[0];

  useFrame((state, delta) => {
    if (journey.reducedMotion) {
      return;
    }
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
    if (inner.current) {
      inner.current.scale.setScalar(pulse);
      inner.current.rotation.y += delta * 0.1;
    }
    if (ringA.current) {
      ringA.current.rotation.z += delta * 0.04;
    }
    if (ringB.current) {
      ringB.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <group
      ref={group}
      position={[
        dest.planetPos[0] * xScale,
        dest.planetPos[1],
        dest.planetPos[2],
      ]}
    >
      <mesh ref={inner}>
        <sphereGeometry args={[dest.radius, 48, 48]} />
        <meshStandardMaterial
          color={MONO.charcoal}
          roughness={0.35}
          metalness={0.18}
          emissive={MONO.mid}
          emissiveIntensity={0.22}
        />
      </mesh>
      <mesh scale={1.12}>
        <icosahedronGeometry args={[dest.radius, 0]} />
        <meshBasicMaterial
          color={MONO.mist}
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.1, 0.16, 0.1]}>
        <torusGeometry args={[1.08, 0.006, 8, 96]} />
        <meshBasicMaterial color={MONO.paper} transparent opacity={0.45} />
      </mesh>
      <mesh ref={ringB} rotation={[0.72, 0.85, 0.4]}>
        <torusGeometry args={[1.42, 0.004, 8, 80]} />
        <meshBasicMaterial color={MONO.silver} transparent opacity={0.22} />
      </mesh>
      <pointLight
        color={MONO.white}
        intensity={1.6}
        distance={18}
        decay={2}
      />
    </group>
  );
}
