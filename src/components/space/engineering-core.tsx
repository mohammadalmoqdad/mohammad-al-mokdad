"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh } from "three";
import { CORE_POSITION } from "@/data/space-config";
import { spaceRuntime } from "@/lib/space-runtime";

export function EngineeringCore() {
  const group = useRef<Group>(null);
  const inner = useRef<Mesh>(null);
  const cage = useRef<Mesh>(null);
  const ringA = useRef<Mesh>(null);
  const ringB = useRef<Mesh>(null);
  const mobile = spaceRuntime.quality === "mobile";

  useFrame((state, delta) => {
    if (spaceRuntime.reducedMotion) {
      return;
    }
    const t = state.clock.elapsedTime;
    if (inner.current) {
      inner.current.rotation.y += delta * 0.12;
    }
    if (cage.current) {
      cage.current.rotation.y -= delta * 0.08;
      cage.current.rotation.z = Math.sin(t * 0.15) * 0.08;
    }
    if (ringA.current) {
      ringA.current.rotation.z += delta * 0.05;
    }
    if (ringB.current) {
      ringB.current.rotation.x += delta * 0.035;
    }
    if (group.current && spaceRuntime.quality === "desktop") {
      group.current.rotation.y = spaceRuntime.pointerX * 0.08;
      group.current.rotation.x = -spaceRuntime.pointerY * 0.05;
    }
  });

  return (
    <group ref={group} position={CORE_POSITION}>
      <mesh ref={inner}>
        <sphereGeometry args={[0.52, mobile ? 24 : 48, mobile ? 24 : 48]} />
        <meshStandardMaterial
          color="#9bb6ff"
          emissive="#4f7cff"
          emissiveIntensity={1.35}
          roughness={0.28}
          metalness={0.2}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshBasicMaterial
          color="#4f7cff"
          transparent
          opacity={0.09}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={cage} scale={1.18}>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshBasicMaterial
          color="#c5d4ff"
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.15, 0.18, 0.12]}>
        <torusGeometry args={[1.08, 0.006, 8, mobile ? 64 : 128]} />
        <meshBasicMaterial color="#8aa8ff" transparent opacity={0.42} />
      </mesh>
      <mesh ref={ringB} rotation={[0.7, 0.9, 0.4]}>
        <torusGeometry args={[1.46, 0.0045, 8, mobile ? 48 : 96]} />
        <meshBasicMaterial color="#50cfe6" transparent opacity={0.22} />
      </mesh>
      <pointLight color="#4f7cff" intensity={6.5} distance={12} decay={2} />
    </group>
  );
}
