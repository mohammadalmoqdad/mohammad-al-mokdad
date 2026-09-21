"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BackSide,
  ClampToEdgeWrapping,
  Group,
  LinearSRGBColorSpace,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
  Vector2,
  CanvasTexture,
} from "three";
import { MONO } from "@/data/mono-palette";
import {
  PLANET_LOOK,
} from "@/data/planet-look";
import { portfolio } from "@/data/portfolio";
import {
  bakeEarthClouds,
  bakeMoonSurfaces,
  bakePlanetSurfaces,
  bakeSaturnRings,
  visualPlanetId,
} from "@/lib/bake-planet-maps";
import { enqueueIdleSoon } from "@/lib/idle-work";
import { patchPlanetMaterial } from "@/lib/planet-shader";
import { hexToRgb } from "@/lib/utils";
import { journey } from "@/lib/journey-store";
import { useQualityTier } from "@/hooks/use-quality-tier";
import type {
  IMonoPlanetProps,
  IPlanetCompileShader,
  IPlanetRadiusProps,
  IPlanetSurfaceMaps,
  TPlanetId,
} from "@/types/space";

function configureMap(texture: CanvasTexture, color: boolean): CanvasTexture {
  texture.wrapS = RepeatWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.anisotropy = 4;
  texture.colorSpace = color ? SRGBColorSpace : LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function loadSurface(maps: IPlanetSurfaceMaps): {
  albedo: Texture;
  normal: Texture;
  roughness: Texture;
  bump: Texture;
} {
  return {
    albedo: configureMap(new CanvasTexture(maps.albedo), true),
    normal: configureMap(new CanvasTexture(maps.normal), false),
    roughness: configureMap(new CanvasTexture(maps.roughness), false),
    bump: configureMap(new CanvasTexture(maps.bump), false),
  };
}

export function MonoPlanet({ destination, xScale }: IMonoPlanetProps) {
  const body = useRef<Mesh>(null);
  const quality = useQualityTier();
  const [maps, setMaps] = useState<IPlanetSurfaceMaps | null>(null);
  const visualPlanet = visualPlanetId(destination.id, destination.planet);
  const look = PLANET_LOOK[visualPlanet as Exclude<TPlanetId, "core">];
  const segments = quality === "high" ? 96 : quality === "medium" ? 64 : 32;
  const normalScale = useMemo(
    () => new Vector2(look.normalScale, look.normalScale),
    [look.normalScale],
  );

  const bodyMat = useRef<MeshStandardMaterial>(null);
  const fade = useRef(0);
  const rimRgb = useMemo(() => hexToRgb(look.rim), [look.rim]);
  const handleCompile = useCallback(
    (shader: IPlanetCompileShader) => {
      patchPlanetMaterial(shader, rimRgb, visualPlanet === "saturn");
    },
    [rimRgb, visualPlanet],
  );

  useEffect(() => {
    let disposed = false;
    enqueueIdleSoon(() => {
      const next = bakePlanetSurfaces(visualPlanet, quality);
      if (!disposed) {
        setMaps(next);
      }
    });
    return () => {
      disposed = true;
    };
  }, [quality, visualPlanet]);

  const textures = useMemo(() => (maps ? loadSurface(maps) : null), [maps]);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (textures) {
      invalidate();
    }
    return () => {
      textures?.albedo.dispose();
      textures?.normal.dispose();
      textures?.roughness.dispose();
      textures?.bump.dispose();
    };
  }, [invalidate, textures]);

  useFrame((_, delta) => {
    if (bodyMat.current) {
      const target = textures ? 1 : 0;
      fade.current += (target - fade.current) * Math.min(1, delta / 0.12);
      bodyMat.current.emissiveIntensity = (1 - fade.current) * 0.08;
    }
    if (journey.reducedMotion || !body.current) {
      return;
    }
    const speed = visualPlanet === "jupiter" ? 0.008 : 0.005;
    body.current.rotation.y += speed * delta;
  });

  return (
    <group
      position={[
        (destination.planetPos[0] + look.frameShift[0]) * xScale,
        destination.planetPos[1] + look.frameShift[1],
        destination.planetPos[2] + look.frameShift[2],
      ]}
      rotation={look.tilt}
    >
      <mesh ref={body}>
        <sphereGeometry args={[destination.radius, segments, segments]} />
        <meshStandardMaterial
          ref={bodyMat}
          color={textures ? "#ffffff" : MONO.slate}
          emissive={MONO.slate}
          emissiveIntensity={textures ? 0 : 0.08}
          map={textures?.albedo}
          normalMap={textures?.normal}
          normalScale={normalScale}
          roughnessMap={textures?.roughness}
          bumpMap={textures?.bump}
          bumpScale={look.bumpScale}
          roughness={look.roughness}
          metalness={look.metalness}
          envMapIntensity={0.22}
          onBeforeCompile={handleCompile}
        />
      </mesh>
      <mesh scale={1.016}>
        <sphereGeometry args={[destination.radius, 24, 24]} />
        <meshBasicMaterial
          color={look.atmosphere}
          transparent
          opacity={look.atmosphereOpacity}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>
      {visualPlanet === "saturn" ? (
        <SaturnRings radius={destination.radius} />
      ) : null}
      {visualPlanet === "mars" ? <MarsNodes /> : null}
      {visualPlanet === "jupiter" ? <JupiterMoons /> : null}
      {visualPlanet === "earth" ? <EarthClouds radius={destination.radius} /> : null}
      {visualPlanet === "earth" ? <ContactMoon radius={destination.radius} /> : null}
    </group>
  );
}

function SaturnRings({ radius }: IPlanetRadiusProps) {
  const quality = useQualityTier();
  const marker = useRef<Mesh>(null);
  const invalidate = useThree((state) => state.invalidate);
  const [ringCanvas, setRingCanvas] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
    enqueueIdleSoon(() => {
      setRingCanvas(bakeSaturnRings(quality));
    });
  }, [quality]);
  const texture = useMemo(
    () => (ringCanvas ? new CanvasTexture(ringCanvas) : null),
    [ringCanvas],
  );
  useEffect(() => {
    if (texture) {
      invalidate();
    }
    return () => {
      texture?.dispose();
    };
  }, [invalidate, texture]);

  useFrame(() => {
    if (!marker.current) {
      return;
    }
    const items = portfolio.experience.items;
    const index = Math.max(
      0,
      items.findIndex((item) => item.id === journey.experienceId),
    );
    const angle = (index / Math.max(1, items.length)) * Math.PI * 2 - 0.4;
    const dist = radius * 1.78;
    marker.current.position.set(
      Math.cos(angle) * dist,
      0.02,
      Math.sin(angle) * dist,
    );
  });

  return (
    <group rotation={[1.22, 0.18, 0.28]}>
      <mesh>
        <ringGeometry
          args={[radius * 1.35, radius * 2.15, quality === "high" ? 96 : 48]}
        />
        <meshBasicMaterial
          map={texture as Texture | null}
          color="#e4d4b6"
          transparent
          opacity={0.85}
          side={2}
          depthWrite={false}
        />
      </mesh>
      {quality === "high" ? (
        <mesh>
          <ringGeometry args={[radius * 1.52, radius * 1.68, 64]} />
          <meshBasicMaterial
            color="#cbbfa4"
            transparent
            opacity={0.22}
            side={2}
            depthWrite={false}
          />
        </mesh>
      ) : null}
      {quality === "high"
        ? Array.from({ length: 8 }, (_, index) => (
            <mesh
              key={index}
              position={[
                Math.cos((index / 8) * Math.PI * 2) * radius * 1.78,
                0,
                Math.sin((index / 8) * Math.PI * 2) * radius * 1.78,
              ]}
            >
              <boxGeometry args={[0.012, 0.012, 0.05]} />
              <meshBasicMaterial color="#cfc3aa" transparent opacity={0.35} />
            </mesh>
          ))
        : null}
      <mesh ref={marker}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color="#f1f1f1" />
      </mesh>
    </group>
  );
}

function useMoonTextures() {
  const quality = useQualityTier();
  const invalidate = useThree((state) => state.invalidate);
  const [maps, setMaps] = useState<IPlanetSurfaceMaps | null>(null);
  useEffect(() => {
    enqueueIdleSoon(() => {
      setMaps(bakeMoonSurfaces(quality));
    });
  }, [quality]);
  const textures = useMemo(() => (maps ? loadSurface(maps) : null), [maps]);
  const normalScale = useMemo(() => new Vector2(1.1, 1.1), []);
  useEffect(() => {
    if (textures) {
      invalidate();
    }
    return () => {
      textures?.albedo.dispose();
      textures?.normal.dispose();
      textures?.roughness.dispose();
      textures?.bump.dispose();
    };
  }, [invalidate, textures]);
  return { textures, normalScale };
}

function JupiterMoons() {
  const group = useRef<Group>(null);
  const ids = portfolio.work.items.map((item) => item.id);
  const { textures, normalScale } = useMoonTextures();

  useFrame((state) => {
    if (!group.current) {
      return;
    }
    group.current.children.forEach((child, index) => {
      const id = ids[index];
      const active = id === journey.workId;
      child.scale.setScalar(active ? 1.35 : 1);
      const mesh = child as Mesh;
      const material = mesh.material;
      if (material instanceof MeshStandardMaterial) {
        material.emissiveIntensity = active ? 0.12 : 0;
      }
      if (journey.reducedMotion) {
        return;
      }
      const t = state.clock.elapsedTime * (0.16 - index * 0.02) + index * 1.7;
      const dist = 1.85 + index * 0.22;
      child.position.set(
        Math.cos(t) * dist,
        Math.sin(t * 0.4) * 0.16,
        Math.sin(t) * dist,
      );
    });
  });

  return (
    <group ref={group}>
      {ids.map((id) => (
        <mesh key={id}>
          <sphereGeometry args={[0.1, 24, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            map={textures?.albedo}
            normalMap={textures?.normal}
            normalScale={normalScale}
            roughnessMap={textures?.roughness}
            bumpMap={textures?.bump}
            bumpScale={0.035}
            roughness={0.94}
            metalness={0.02}
            emissive="#f1f1f1"
            emissiveIntensity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function MarsNodes() {
  const group = useRef<Group>(null);
  const ids = ["frontends", "apis", "quality"] as const;
  const { textures, normalScale } = useMoonTextures();
  useFrame((state) => {
    if (!group.current) {
      return;
    }
    group.current.children.forEach((child, index) => {
      const id = ids[index];
      const active = id === journey.capabilityId;
      child.scale.setScalar(active ? 1.28 : 1);
      if (journey.reducedMotion) {
        return;
      }
      const t = state.clock.elapsedTime * (0.18 - index * 0.03) + index * 2;
      const dist = 1.35 + index * 0.28;
      child.position.set(
        Math.cos(t) * dist,
        Math.sin(t * 0.5) * 0.18,
        Math.sin(t) * dist,
      );
    });
  });
  return (
    <group ref={group}>
      {ids.map((id) => (
        <mesh key={id}>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            map={textures?.albedo}
            normalMap={textures?.normal}
            normalScale={normalScale}
            roughnessMap={textures?.roughness}
            bumpMap={textures?.bump}
            bumpScale={0.04}
            roughness={0.94}
            metalness={0.02}
          />
        </mesh>
      ))}
    </group>
  );
}

function EarthClouds({ radius }: IPlanetRadiusProps) {
  const quality = useQualityTier();
  const [map, setMap] = useState<CanvasTexture | null>(null);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    let disposed = false;
    enqueueIdleSoon(() => {
      const next = configureMap(new CanvasTexture(bakeEarthClouds(quality)), true);
      if (disposed) {
        next.dispose();
        return;
      }
      setMap(next);
      invalidate();
    });
    return () => {
      disposed = true;
    };
  }, [invalidate, quality]);
  useEffect(
    () => () => {
      map?.dispose();
    },
    [map],
  );
  if (!map) {
    return null;
  }
  return (
    <mesh scale={1.012}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshBasicMaterial map={map} transparent opacity={0.82} depthWrite={false} />
    </mesh>
  );
}

function ContactMoon({ radius }: IPlanetRadiusProps) {
  const { textures, normalScale } = useMoonTextures();
  return (
    <mesh position={[radius * 1.42, radius * 0.32, radius * 0.28]}>
      <sphereGeometry args={[radius * 0.18, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        map={textures?.albedo}
        normalMap={textures?.normal}
        normalScale={normalScale}
        roughnessMap={textures?.roughness}
        bumpMap={textures?.bump}
        bumpScale={0.05}
        roughness={0.96}
        metalness={0.01}
      />
    </mesh>
  );
}
