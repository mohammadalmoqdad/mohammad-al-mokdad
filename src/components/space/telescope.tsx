"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, MeshBasicMaterial, Object3D, Vector3 } from "three";
import { DESTINATIONS, TELESCOPE_POS, TELESCOPE_REST_AIM } from "@/data/journey";
import { MONO } from "@/data/mono-palette";
import { journey } from "@/lib/journey-store";
import { useQualityTier } from "@/hooks/use-quality-tier";
import type { ITelescopeProps } from "@/types/space";

export function ObservatoryTelescope({ xScale }: ITelescopeProps) {
  const quality = useQualityTier();
  const tube = useRef<Group>(null);
  const lens = useRef<Mesh>(null);
  const dummy = useRef(new Object3D());
  const restAim = useMemo(
    () =>
      new Vector3(
        TELESCOPE_REST_AIM[0] * xScale,
        TELESCOPE_REST_AIM[1],
        TELESCOPE_REST_AIM[2],
      ),
    [xScale],
  );
  const jupiterAim = useMemo(() => {
    const dest = DESTINATIONS[1];
    return new Vector3(
      dest.planetPos[0] * xScale,
      dest.planetPos[1],
      dest.planetPos[2],
    );
  }, [xScale]);
  const aim = useRef(restAim.clone());
  const compact = quality !== "high";
  const mobile = quality === "low";
  const scale = mobile ? 0.46 : compact ? 0.74 : 1;

  useFrame((state, delta) => {
    if (!tube.current) {
      return;
    }
    const visible = journey.telescopeVisible > 0.04 && !journey.warp;
    const root = tube.current.parent;
    if (root) {
      root.visible = visible;
    }
    if (!visible) {
      return;
    }

    const amount = journey.reducedMotion ? 0 : journey.telescopeAim;
    aim.current.lerpVectors(restAim, jupiterAim, amount);
    if (
      quality === "high" &&
      !journey.reducedMotion &&
      journey.t < 0.35 &&
      journey.pointerX < -0.12 &&
      journey.pointerY > 0.18
    ) {
      aim.current.x += journey.pointerX * 0.06;
      aim.current.y += -journey.pointerY * 0.04;
    }
    dummy.current.position.set(
      TELESCOPE_POS[0] * xScale,
      TELESCOPE_POS[1] - (mobile ? 0.55 : 0),
      TELESCOPE_POS[2],
    );
    dummy.current.lookAt(aim.current);
    if (journey.reducedMotion) {
      tube.current.quaternion.copy(dummy.current.quaternion);
    } else {
      const lambda = 1 - Math.exp(-2.2 * delta);
      tube.current.quaternion.slerp(dummy.current.quaternion, lambda);
      if (amount < 0.12) {
        tube.current.rotateZ(Math.sin(state.clock.elapsedTime * 0.32) * 0.00035);
      }
    }
    const material = lens.current?.material;
    if (material instanceof MeshBasicMaterial) {
      material.opacity = 0.16 + journey.lensFocus * 0.5;
    }
  });

  return (
    <group
      position={[
        TELESCOPE_POS[0] * xScale,
        TELESCOPE_POS[1] - (mobile ? 0.55 : 0),
        TELESCOPE_POS[2],
      ]}
      scale={scale}
    >
      <group ref={tube}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 1.15, compact ? 8 : 14]} />
          <meshStandardMaterial
            color={MONO.charcoal}
            roughness={0.62}
            metalness={0.28}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.58]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, compact ? 8 : 14]} />
          <meshStandardMaterial
            color={MONO.graphite}
            roughness={0.45}
            metalness={0.4}
          />
        </mesh>
        <mesh ref={lens} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.64]}>
          <circleGeometry args={[0.078, compact ? 12 : 24]} />
          <meshBasicMaterial
            color={MONO.mist}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.62]}>
          <cylinderGeometry args={[0.04, 0.05, 0.22, 8]} />
          <meshStandardMaterial
            color={MONO.gunmetal}
            roughness={0.5}
            metalness={0.32}
          />
        </mesh>
      </group>
      <mesh position={[0, -0.18, -0.08]}>
        <boxGeometry args={[0.16, 0.12, 0.16]} />
        <meshStandardMaterial color={MONO.ink} roughness={0.7} metalness={0.18} />
      </mesh>
      {compact ? null : <TelescopeMount />}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.28, 0.04]}>
        <ringGeometry args={[0.55, 0.72, 32]} />
        <meshBasicMaterial
          color={MONO.charcoal}
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function TelescopeMount() {
  return (
    <group position={[0, -0.55, -0.08]}>
      {[-0.55, 0.55, 0].map((x) => (
        <mesh
          key={x}
          position={[x * 0.28, -0.42, x === 0 ? 0.22 : -0.18]}
          rotation={[x === 0 ? 0.35 : -0.42, 0, x * 0.28]}
        >
          <cylinderGeometry args={[0.018, 0.022, 0.92, 6]} />
          <meshStandardMaterial
            color={MONO.graphite}
            roughness={0.7}
            metalness={0.22}
          />
        </mesh>
      ))}
    </group>
  );
}
