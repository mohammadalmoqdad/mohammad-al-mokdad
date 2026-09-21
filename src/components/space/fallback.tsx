"use client";

import { useMemo } from "react";
import { seededRandom } from "@/lib/utils";

export function SpaceFallback() {
  const stars = useMemo(() => {
    const rand = seededRandom(91);
    return Array.from({ length: 70 }, (_, index) => ({
      id: index,
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size: rand() > 0.86 ? 2 : 1,
      opacity: 0.16 + rand() * 0.45,
    }));
  }, []);

  return (
    <div className="space-fallback" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="space-fallback-star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
