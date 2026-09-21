import type { ISkyLabel, ISkyStats } from "@/types/space";

export const skyStats: ISkyStats = {
  field: 0,
  fieldVisible: 0,
  hero: 0,
  heroVisible: 0,
  galaxies: 0,
  galaxyVisible: 0,
};

let skyLabelSnapshot: readonly ISkyLabel[] = [];
const labelListeners = new Set<() => void>();

export function getSkyLabels(): readonly ISkyLabel[] {
  return skyLabelSnapshot;
}

export function setSkyLabels(next: ISkyLabel[]): void {
  skyLabelSnapshot = next;
  labelListeners.forEach((listener) => {
    listener();
  });
}

export function subscribeSkyLabels(listener: () => void): () => void {
  labelListeners.add(listener);
  return () => {
    labelListeners.delete(listener);
  };
}
