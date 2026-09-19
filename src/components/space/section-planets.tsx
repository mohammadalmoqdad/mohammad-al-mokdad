"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import {
  ABOUT_PLANET,
  CAPABILITY_BODIES,
  CONTACT_HORIZON,
  EXPERIENCE_PLANET,
  WORK_MOONS,
  WORK_PLANET,
} from "@/data/space-config";
import { portfolio } from "@/data/portfolio";
import { spaceRuntime } from "@/lib/space-runtime";
import { BandedPlanet, Planet } from "@/components/space/planet";
import type { TSectionId } from "@/types/portfolio";

interface ISectionPlanetsProps {
  workId: string;
  experienceId: string;
  capabilityId: string;
  section: TSectionId;
}

export function SectionPlanets({
  workId,
  experienceId,
  capabilityId,
  section,
}: ISectionPlanetsProps) {
  const segments = spaceRuntime.quality === "mobile" ? 28 : 48;
  const workActive = section === "work";
  const experienceActive = section === "experience";
  const aboutActive = section === "about";
  const contactActive = section === "contact";
  const capabilitiesActive = section === "capabilities";

  return (
    <group>
      <BandedPlanet config={WORK_PLANET} emphasis={workActive} segments={segments} />
      <WorkMoons workId={workId} section={section} />
      <EarlierBuildBodies />
      <Planet
        config={EXPERIENCE_PLANET}
        emphasis={experienceActive}
        segments={segments}
      />
      <ExperienceRing experienceId={experienceId} section={section} />
      <CapabilitySystem
        active={capabilitiesActive}
        capabilityId={capabilityId}
      />
      <Planet config={ABOUT_PLANET} emphasis={aboutActive} segments={segments} />
      <Planet
        config={CONTACT_HORIZON}
        emphasis={contactActive}
        segments={Math.max(24, segments - 12)}
      />
    </group>
  );
}

function WorkMoons({
  workId,
  section,
}: {
  workId: string;
  section: TSectionId;
}) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current || spaceRuntime.reducedMotion) {
      return;
    }
    group.current.children.forEach((child, index) => {
      const moon = WORK_MOONS[index];
      if (!moon) {
        return;
      }
      const t = state.clock.elapsedTime * moon.speed + index * 1.7;
      child.position.set(
        Math.cos(t) * moon.distance,
        Math.sin(t * 0.6) * 0.22,
        Math.sin(t) * moon.distance * 0.78,
      );
    });
  });

  return (
    <group ref={group} position={WORK_PLANET.position}>
      {WORK_MOONS.map((moon) => {
        const active = workId === moon.id && section === "work";
        return (
          <mesh key={moon.id}>
            <sphereGeometry args={[moon.size, 16, 16]} />
            <meshStandardMaterial
              color={moon.color}
              emissive={moon.color}
              emissiveIntensity={active ? 1.4 : 0.35}
              roughness={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function EarlierBuildBodies() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current || spaceRuntime.reducedMotion) {
      return;
    }
    const t = state.clock.elapsedTime * 0.08;
    group.current.rotation.y = t;
  });

  if (spaceRuntime.quality === "mobile") {
    return null;
  }

  return (
    <group ref={group} position={WORK_PLANET.position} rotation={[0.7, 0.2, 0.4]}>
      {portfolio.work.earlierBuilds.items.map((item, index) => (
        <mesh
          key={item.id}
          position={[
            Math.cos(index * 1.8) * 3.35,
            -0.35 + index * 0.12,
            Math.sin(index * 1.8) * 2.4,
          ]}
        >
          <icosahedronGeometry args={[0.045, 0]} />
          <meshStandardMaterial
            color="#9aa6b8"
            roughness={0.8}
            emissive="#2a3344"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function ExperienceRing({
  experienceId,
  section,
}: {
  experienceId: string;
  section: TSectionId;
}) {
  const ring = useRef<Group>(null);
  const markers = useRef<Group>(null);
  const roles = portfolio.experience.items.filter(
    (item) => item.visualWeight === "primary",
  );

  useFrame((_, delta) => {
    if (spaceRuntime.reducedMotion) {
      return;
    }
    if (ring.current) {
      ring.current.rotation.z += delta * 0.015;
    }
  });

  return (
    <group position={EXPERIENCE_PLANET.position}>
      <group ref={ring} rotation={[1.18, 0.22, 0.35]}>
        <mesh>
          <torusGeometry args={[1.58, 0.01, 8, 96]} />
          <meshBasicMaterial
            color="#8aa8ff"
            transparent
            opacity={section === "experience" ? 0.45 : 0.16}
          />
        </mesh>
        <group ref={markers}>
          {roles.map((role, index) => {
            const angle = (index / roles.length) * Math.PI * 2;
            const active = experienceId === role.id;
            return (
              <mesh
                key={role.id}
                position={[Math.cos(angle) * 1.58, Math.sin(angle) * 1.58, 0]}
              >
                <sphereGeometry args={[active ? 0.045 : 0.028, 12, 12]} />
                <meshBasicMaterial
                  color={active ? "#e4edff" : "#6d8fff"}
                  transparent
                  opacity={active ? 1 : 0.55}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
}

function CapabilitySystem({
  active,
  capabilityId,
}: {
  active: boolean;
  capabilityId: string;
}) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current || spaceRuntime.reducedMotion) {
      return;
    }
    group.current.children.forEach((child, index) => {
      const body = CAPABILITY_BODIES[index];
      if (!body) {
        return;
      }
      const t = state.clock.elapsedTime * body.speed + index * 2.1;
      child.position.set(
        Math.cos(t) * body.distance,
        Math.sin(t * 0.7) * 0.28,
        Math.sin(t) * body.distance * 0.7,
      );
    });
  });

  return (
    <group position={[3.85, 0.85, -7.1]}>
      <mesh>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color="#151c2c"
          emissive="#243152"
          emissiveIntensity={active ? 0.5 : 0.2}
          roughness={0.7}
        />
      </mesh>
      <mesh rotation={[1.1, 0.2, 0.4]}>
        <torusGeometry args={[1.62, 0.006, 8, 80]} />
        <meshBasicMaterial
          color="#50cfe6"
          transparent
          opacity={active ? 0.28 : 0.1}
        />
      </mesh>
      <group ref={group}>
        {CAPABILITY_BODIES.map((body) => {
          const lit = active && capabilityId === body.id;
          return (
            <mesh key={body.id}>
              <sphereGeometry args={[body.radius, 16, 16]} />
              <meshStandardMaterial
                color={body.color}
                emissive={body.color}
                emissiveIntensity={lit ? 1.6 : 0.35}
                roughness={0.35}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
