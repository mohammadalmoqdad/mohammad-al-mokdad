"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { DESTINATIONS } from "@/data/journey";
import { planetBakeMetrics, planetMapLabel } from "@/lib/bake-planet-maps";
import { journey } from "@/lib/journey-store";
import { skyStats } from "@/lib/sky-stats";
import type { IJourneyDebugSnap } from "@/types/space";

function subscribeDebug() {
  return () => undefined;
}

function readDebugFlag(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    new URLSearchParams(window.location.search).get("debug") === "journey"
  );
}

export function JourneyDebug() {
  const enabled = useSyncExternalStore(
    subscribeDebug,
    readDebugFlag,
    () => false,
  );
  const [snap, setSnap] = useState<IJourneyDebugSnap>({
    t: 0,
    transit: 0,
    velocity: 0,
    from: 0,
    to: 0,
    warp: false,
    quality: "high",
    fps: 0,
    telescopeAim: 0,
    lensFocus: 0,
    telescopeVisible: 1,
    textureResolution: "1024x512",
    fieldVisible: 0,
    heroVisible: 0,
    galaxyVisible: 0,
  });

  useEffect(() => {
    journey.debug = enabled;
    if (!enabled) {
      return;
    }
    let frames = 0;
    let last = performance.now();
    let fps = 0;
    let id = 0;
    const tick = (now: number) => {
      frames += 1;
      if (now - last >= 500) {
        fps = (frames * 1000) / (now - last);
        frames = 0;
        last = now;
      }
      setSnap({
        t: journey.t,
        transit: journey.transit,
        velocity: journey.velocity,
        from: journey.from,
        to: journey.to,
        warp: journey.warp,
        quality: journey.quality,
        fps,
        telescopeAim: journey.telescopeAim,
        lensFocus: journey.lensFocus,
        telescopeVisible: journey.telescopeVisible,
        textureResolution: planetMapLabel(journey.quality),
        fieldVisible: skyStats.fieldVisible,
        heroVisible: skyStats.heroVisible,
        galaxyVisible: skyStats.galaxyVisible,
      });
      id = window.requestAnimationFrame(tick);
    };
    id = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(id);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[80] rounded-md border border-line bg-ink/80 p-3 font-mono text-[0.65rem] text-mist">
      <p>t {snap.t.toFixed(3)}</p>
      <p>transit {snap.transit.toFixed(3)}</p>
      <p>vel {snap.velocity.toFixed(3)}</p>
      <p>
        {DESTINATIONS[snap.from]?.planet} → {DESTINATIONS[snap.to]?.planet}
      </p>
      <p>warp {snap.warp ? "yes" : "no"}</p>
      <p>quality {snap.quality}</p>
      <p>fps {snap.fps.toFixed(0)}</p>
      <p>telescopeAim {snap.telescopeAim.toFixed(2)}</p>
      <p>lensFocus {snap.lensFocus.toFixed(2)}</p>
      <p>telescopeVisible {snap.telescopeVisible.toFixed(2)}</p>
      <p>planetMaps {snap.textureResolution}</p>
      <p>
        field {skyStats.field} vis {snap.fieldVisible}
      </p>
      <p>
        hero {skyStats.hero} vis {snap.heroVisible}
      </p>
      <p>
        galaxies {skyStats.galaxies} vis {snap.galaxyVisible}
      </p>
      <p>jupiterBandΔ {planetBakeMetrics.jupiterBandContrast.toFixed(3)}</p>
    </div>
  );
}
