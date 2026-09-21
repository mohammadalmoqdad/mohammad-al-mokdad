"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { FieldStars } from "@/components/space/sky/field-stars";
import { HeroStars } from "@/components/space/sky/hero-stars";
import { GalaxyField } from "@/components/space/sky/galaxy-field";
import { DeepHaze } from "@/components/space/sky/deep-haze";
import { Constellations } from "@/components/space/sky/constellations";

export function CelestialSphere() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    group.current?.position.copy(state.camera.position);
  }, -1);

  return (
    <group ref={group} name="celestial" renderOrder={-10}>
      <FieldStars />
      <HeroStars />
      <GalaxyField />
      <DeepHaze />
      <Constellations />
    </group>
  );
}
