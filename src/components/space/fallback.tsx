"use client";

import { useMemo } from "react";
import { seededRandom } from "@/lib/utils";

export function SpaceFallback() {
  const stars = useMemo(() => {
    const rand = seededRandom(91);
    return Array.from({ length: 90 }, (_, index) => ({
      id: index,
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size: rand() > 0.86 ? 2.2 : rand() > 0.6 ? 1.4 : 1,
      opacity: 0.18 + rand() * 0.55,
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
      <span
        className="absolute right-[12%] top-[22%] h-40 w-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(79 124 255 / 0.45), rgb(79 124 255 / 0.08) 42%, transparent 70%)",
        }}
      />
      <span className="absolute right-[8%] top-[18%] h-72 w-72 rounded-full border border-white/10" />
      <span className="absolute right-[2%] top-[12%] h-[28rem] w-[28rem] rounded-full border border-white/5" />
    </div>
  );
}
