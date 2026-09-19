"use client";

import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CONSTELLATION_LINKS, NAMED_STARS } from "@/data/space-config";
import { spaceRuntime } from "@/lib/space-runtime";
import type { TStarAnchorId } from "@/types/space";

export function NamedStars() {
  const opacity = useRef(0.4);

  useFrame((_, delta) => {
    const target =
      spaceRuntime.quality === "desktop"
        ? spaceRuntime.section === "hero"
          ? 0.55
          : 0.38
        : 0;
    opacity.current += (target - opacity.current) * Math.min(1, delta * 3);
  });

  if (spaceRuntime.quality !== "desktop") {
    return null;
  }

  return (
    <group>
      {NAMED_STARS.map((star) => (
        <NamedStarLabel key={star.id} id={star.id} />
      ))}
      <ConstellationHints />
    </group>
  );
}

function NamedStarLabel({ id }: { id: TStarAnchorId }) {
  const star = NAMED_STARS.find((item) => item.id === id);
  const visible = star?.chapters.includes(spaceRuntime.section) ?? false;

  if (!star || !visible) {
    return null;
  }

  return (
    <Html
      position={star.position}
      center
      style={{ pointerEvents: "none" }}
      zIndexRange={[1, 0]}
    >
      <span className="named-star" aria-hidden="true">
        {star.name}
      </span>
    </Html>
  );
}

function ConstellationHints() {
  const byId = useMemo(
    () => Object.fromEntries(NAMED_STARS.map((star) => [star.id, star])),
    [],
  );

  return (
    <>
      {CONSTELLATION_LINKS.filter((link) =>
        link.chapters.includes(spaceRuntime.section),
      ).map((link) => {
        const from = byId[link.from];
        const to = byId[link.to];
        if (!from || !to) {
          return null;
        }
        return (
          <Line
            key={`${link.from}-${link.to}`}
            points={[from.position, to.position]}
            color="#bfd7ff"
            transparent
            opacity={0.08}
            lineWidth={1}
          />
        );
      })}
    </>
  );
}
