import { portfolio } from "@/data/portfolio";
import { bell, clamp, smoothstep } from "@/lib/math";
import type { IJourneyState, TSpaceQuality } from "@/types/space";
import type { IPointerUi } from "@/types/ui";

export const journey: IJourneyState = {
  t: 0,
  transit: 0,
  velocity: 0,
  from: 0,
  to: 0,
  warp: false,
  snap: true,
  reducedMotion: false,
  quality: "high",
  pointerX: 0,
  pointerY: 0,
  workId: portfolio.work.items[0].id,
  experienceId: portfolio.experience.items[0].id,
  capabilityId: portfolio.capabilities.items[0].id,
  debug: false,
  telescopeAim: 0,
  lensFocus: 0,
  telescopeVisible: 1,
  textureResolution: "512x256",
  booted: false,
};

export const pointerUi: IPointerUi = {
  clientX: 0,
  clientY: 0,
  target: null,
};

let previousT = 0;
let previousTime = 0;
const frameListeners = new Set<() => void>();
const sceneReadyListeners = new Set<() => void>();
const pointerListeners = new Set<() => void>();
const rootVarCache: Record<string, string> = {};
let sceneReady = false;

export function subscribeJourneyFrame(listener: () => void): () => void {
  frameListeners.add(listener);
  return () => {
    frameListeners.delete(listener);
  };
}

export function notifyJourneyFrame(): void {
  frameListeners.forEach((listener) => {
    listener();
  });
}

export function subscribeSceneReady(listener: () => void): () => void {
  sceneReadyListeners.add(listener);
  return () => {
    sceneReadyListeners.delete(listener);
  };
}

export function getSceneReady(): boolean {
  return sceneReady;
}

export function markSceneReady(): void {
  if (sceneReady) {
    return;
  }
  sceneReady = true;
  queueMicrotask(() => {
    sceneReadyListeners.forEach((listener) => {
      listener();
    });
  });
}

export function subscribePointerUi(listener: () => void): () => void {
  pointerListeners.add(listener);
  return () => {
    pointerListeners.delete(listener);
  };
}

export function notifyPointerUi(): void {
  pointerListeners.forEach((listener) => {
    listener();
  });
}

function applyTelescope(t: number): void {
  const heroToWork = clamp(t, 0, 1);
  if (journey.reducedMotion) {
    journey.telescopeAim = 0;
    journey.lensFocus = 0;
    journey.telescopeVisible = t < 0.85 ? 1 : 0;
    return;
  }
  journey.telescopeAim = smoothstep(0.1, 0.45, heroToWork);
  journey.lensFocus = t > 1 ? 0 : bell(0.3, 0.6, heroToWork);
  journey.telescopeVisible = 1 - smoothstep(0.65, 0.9, heroToWork);
}

export function setJourneyProgress(
  t: number,
  transit: number,
  from: number,
  to: number,
): void {
  const now =
    typeof performance === "undefined" ? Date.now() : performance.now();
  const dt = Math.max(0.016, (now - previousTime) / 1000);
  journey.velocity = (t - previousT) / dt;
  previousT = t;
  previousTime = now;
  journey.t = t;
  journey.transit = transit;
  journey.from = from;
  journey.to = to;
  applyTelescope(t);
  notifyJourneyFrame();
}

export function setJourneyQuality(quality: TSpaceQuality): void {
  journey.quality = quality;
  journey.textureResolution = quality === "high" ? "512x256" : "384x192";
  notifyJourneyFrame();
}

export function setRootJourneyVars(): void {
  if (typeof document === "undefined") {
    return;
  }
  writeRootVar("--journey-t", journey.t);
  writeRootVar("--journey-transit", journey.transit);
  writeRootVar("--lens-focus", journey.lensFocus);
  writeRootVar("--telescope-aim", journey.telescopeAim);
  writeRootVar("--telescope-visible", journey.telescopeVisible);
}

function writeRootVar(name: string, value: number): void {
  const next = value.toFixed(3);
  if (rootVarCache[name] === next) {
    return;
  }
  rootVarCache[name] = next;
  document.documentElement.style.setProperty(name, next);
}
