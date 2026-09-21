"use client";

import { useSyncExternalStore } from "react";
import {
  getSkyLabels,
  subscribeSkyLabels,
} from "@/lib/sky-stats";

function emptyLabels() {
  return getSkyLabels();
}

export function SkyLabels() {
  const labels = useSyncExternalStore(
    subscribeSkyLabels,
    getSkyLabels,
    emptyLabels,
  );

  return (
    <div className="sky-labels" aria-hidden="true">
      {labels.map((item) =>
        item.visible ? (
          <span
            key={item.id}
            className="sky-label"
            style={{ transform: `translate3d(${item.x}px, ${item.y}px, 0)` }}
          >
            <i className="sky-label-leader" />
            {item.text}
          </span>
        ) : null,
      )}
    </div>
  );
}
