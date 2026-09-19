"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Mesh, Points, Vector3 } from "three";
import { STAR_COLORS, STAR_COUNTS } from "@/data/space-config";
import { spaceRuntime } from "@/lib/space-runtime";
import { hexToRgb, seededRandom } from "@/lib/utils";

interface IStarLayerProps {
  count: number;
  seed: number;
  spread: number;
  size: number;
  opacity: number;
  depthBias: number;
}

function StarLayer({
  count,
  seed,
  spread,
  size,
  opacity,
  depthBias,
}: IStarLayerProps) {
  const points = useRef<Points>(null);
  const { positions, colors } = useMemo(() => {
    const rand = seededRandom(seed);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = STAR_COLORS.map((hex) => {
      const [r, g, b] = hexToRgb(hex);
      return new Color(r / 255, g / 255, b / 255);
    });

    for (let i = 0; i < count; i += 1) {
      const radius = spread * (0.35 + rand() * 0.65);
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.72 + depthBias;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 6;

      const color = palette[Math.floor(rand() * palette.length)] ?? palette[2];
      const shade = 0.55 + rand() * 0.45;
      colors[i * 3] = color.r * shade;
      colors[i * 3 + 1] = color.g * shade;
      colors[i * 3 + 2] = color.b * shade;
    }

    return { positions, colors };
  }, [count, depthBias, seed, spread]);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("color", new BufferAttribute(colors, 3));
    return geo;
  }, [colors, positions]);

  useFrame((_, delta) => {
    if (spaceRuntime.reducedMotion || !points.current) {
      return;
    }
    points.current.rotation.y += delta * 0.0035;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

export function StarField() {
  const count = STAR_COUNTS[spaceRuntime.quality];
  const mobile = spaceRuntime.quality === "mobile";

  return (
    <group>
      <StarLayer
        count={Math.floor(count * 0.55)}
        seed={11}
        spread={38}
        size={mobile ? 0.028 : 0.035}
        opacity={0.55}
        depthBias={0}
      />
      <StarLayer
        count={Math.floor(count * 0.32)}
        seed={29}
        spread={22}
        size={mobile ? 0.04 : 0.05}
        opacity={0.7}
        depthBias={0.4}
      />
      <StarLayer
        count={Math.floor(count * 0.13)}
        seed={47}
        spread={14}
        size={mobile ? 0.055 : 0.07}
        opacity={0.82}
        depthBias={0.8}
      />
    </group>
  );
}

export function ShootingStar() {
  const mesh = useRef<Mesh>(null);
  const nextAt = useRef(48);
  const progress = useRef(-1);
  const from = useMemo(() => new Vector3(), []);
  const to = useMemo(() => new Vector3(), []);
  const current = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    if (
      spaceRuntime.reducedMotion ||
      spaceRuntime.quality !== "desktop" ||
      !mesh.current
    ) {
      return;
    }

    const t = state.clock.elapsedTime;
    if (progress.current < 0 && t > nextAt.current) {
      const jitter = (t * 13) % 1;
      from.set(4.5 + jitter * 3, 3.2 + ((t * 7) % 1) * 1.4, -7);
      to.set(from.x + 4.2, from.y - 1.5, from.z + 0.8);
      progress.current = 0;
      nextAt.current = t + 30 + ((t * 17) % 40);
    }

    if (progress.current < 0) {
      mesh.current.visible = false;
      return;
    }

    progress.current += delta * 1.8;
    const p = Math.min(progress.current, 1);
    current.lerpVectors(from, to, p);
    mesh.current.position.copy(current);
    mesh.current.visible = true;
    const material = mesh.current.material;
    if ("opacity" in material) {
      material.opacity = p < 0.12 ? p * 5 : Math.max(0, 1 - p);
    }
    if (p >= 1) {
      progress.current = -1;
    }
  });

  return (
    <mesh ref={mesh} visible={false}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#e4edff" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
