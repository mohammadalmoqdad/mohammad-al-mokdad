"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackSide, Group, Mesh } from "three";
import { spaceRuntime } from "@/lib/space-runtime";
import type { IPlanetMaterialConfig } from "@/types/space";

interface IPlanetProps {
  config: IPlanetMaterialConfig;
  emphasis?: boolean;
  segments?: number;
}

export function Planet({
  config,
  emphasis = false,
  segments = 48,
}: IPlanetProps) {
  const group = useRef<Group>(null);
  const body = useRef<Mesh>(null);
  const glow = useRef<Mesh>(null);

  const emissiveIntensity = emphasis
    ? config.emissiveIntensity * 1.45
    : config.emissiveIntensity;
  const atmosphereOpacity = emphasis
    ? config.atmosphereOpacity * 1.4
    : config.atmosphereOpacity;

  useFrame((_, delta) => {
    if (spaceRuntime.reducedMotion) {
      return;
    }
    if (body.current) {
      body.current.rotation.y += config.rotationSpeed * delta;
    }
  });

  return (
    <group ref={group} position={config.position}>
      <mesh ref={body}>
        <sphereGeometry args={[config.radius, segments, segments]} />
        <meshStandardMaterial
          color={config.baseColor}
          roughness={config.roughness}
          metalness={0.1}
          emissive={config.emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh ref={glow} scale={config.atmosphereScale}>
        <sphereGeometry args={[config.radius, Math.max(16, segments / 2), Math.max(16, segments / 2)]} />
        <meshBasicMaterial
          color={config.atmosphereColor}
          transparent
          opacity={atmosphereOpacity}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function BandedPlanet({
  config,
  emphasis = false,
  segments = 48,
}: IPlanetProps) {
  const body = useRef<Mesh>(null);
  const uniforms = useMemo(() => ({ uBand: { value: 7.2 } }), []);

  useFrame((_, delta) => {
    if (spaceRuntime.reducedMotion) {
      return;
    }
    if (body.current) {
      body.current.rotation.y += config.rotationSpeed * delta;
    }
  });

  return (
    <group position={config.position}>
      <mesh ref={body}>
        <sphereGeometry args={[config.radius, segments, segments]} />
        <meshStandardMaterial
          color={config.baseColor}
          roughness={config.roughness}
          metalness={0.08}
          emissive={config.emissive}
          emissiveIntensity={emphasis ? config.emissiveIntensity * 1.4 : config.emissiveIntensity}
          onBeforeCompile={(shader) => {
            shader.uniforms.uBand = uniforms.uBand;
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <color_fragment>",
              `#include <color_fragment>
               float bands = sin(vViewPosition.y * 0.35 + sin(vViewPosition.x * 0.22) * 1.8);
               diffuseColor.rgb += bands * 0.035;`,
            );
          }}
        />
      </mesh>
      <mesh scale={config.atmosphereScale}>
        <sphereGeometry args={[config.radius, 24, 24]} />
        <meshBasicMaterial
          color={config.atmosphereColor}
          transparent
          opacity={emphasis ? config.atmosphereOpacity * 1.3 : config.atmosphereOpacity}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
