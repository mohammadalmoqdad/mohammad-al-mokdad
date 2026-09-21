import type { IDestination, ITransferWaypoints, TVec3 } from "@/types/space";

export const REST_RATIO = 0.62;
export const LAST_DESTINATION = 5;

export const TELESCOPE_POS: TVec3 = [-2.15, -2.05, 7.15];
export const TELESCOPE_REST_AIM: TVec3 = [2.15, 1.55, -4.4];

export const DESTINATIONS: readonly IDestination[] = [
  {
    id: "hero",
    index: 0,
    planet: "core",
    planetLabel: "CORE",
    professionalLabel: "CORE",
    sectionLabel: "00 / CORE",
    side: "center",
    planetPos: [3.4, 0.1, 0],
    radius: 0.58,
    rest: {
      cam: [-0.2, 0.4, 8.6],
      look: [5.95, 0.12, -34.22],
    },
  },
  {
    id: "work",
    index: 1,
    planet: "jupiter",
    planetLabel: "JUPITER",
    professionalLabel: "WORK",
    sectionLabel: "01 / WORK",
    side: "right",
    planetPos: [1.7, 0.35, -14],
    radius: 1.28,
    rest: {
      cam: [-3.5, 0.5, -6.6],
      look: [0.15, 0.3, -14],
    },
  },
  {
    id: "experience",
    index: 2,
    planet: "saturn",
    planetLabel: "SATURN",
    professionalLabel: "EXPERIENCE",
    sectionLabel: "02 / EXPERIENCE",
    side: "left",
    planetPos: [-6.0, -0.35, -30],
    radius: 1.15,
    rest: {
      cam: [-0.7, 0.22, -22.4],
      look: [-4.5, -0.32, -30],
    },
  },
  {
    id: "capabilities",
    index: 3,
    planet: "mars",
    planetLabel: "MARS",
    professionalLabel: "WHAT I WORK ON",
    sectionLabel: "03 / WHAT I WORK ON",
    side: "right",
    planetPos: [5.4, 0.55, -44],
    radius: 0.82,
    rest: {
      cam: [0.85, 0.72, -37.4],
      look: [4.05, 0.52, -44],
    },
  },
  {
    id: "about",
    index: 4,
    planet: "neptune",
    planetLabel: "NEPTUNE",
    professionalLabel: "ABOUT",
    sectionLabel: "04 / ABOUT",
    side: "left",
    planetPos: [-6.4, 0.18, -60],
    radius: 1.05,
    rest: {
      cam: [-0.55, 0.28, -51.6],
      look: [-4.7, 0.16, -60],
    },
  },
  {
    id: "contact",
    index: 5,
    planet: "earth",
    planetLabel: "EARTH",
    professionalLabel: "CONTACT",
    sectionLabel: "05 / CONTACT",
    side: "right",
    planetPos: [7.0, 0.16, -72],
    radius: 1.32,
    rest: {
      cam: [1.35, 0.36, -65.4],
      look: [5.15, 0.14, -72],
    },
  },
] as const;

export const TRANSFER_WAYPOINTS: Record<string, ITransferWaypoints> = {
  "hero-work": {
    cam: [[-0.8, 0.75, 1.4], [-2.2, 0.52, -3.8]],
    look: [[1.4, 0.5, -6], [0.7, 0.34, -11]],
  },
  "work-experience": {
    cam: [[-1.4, 0.2, -16.8], [-1.8, -0.4, -23.2]],
    look: [[-0.2, 0.45, -22], [-2.4, 0.1, -27]],
  },
  "experience-capabilities": {
    cam: [
      [-3.5, -1.15, -33.6],
      [0.2, 0.4, -36.8],
      [1.5, -0.45, -39.4],
    ],
    look: [
      [0.1, 2.4, -42],
      [0.4, 1.6, -45],
      [2.2, 0.9, -43],
    ],
  },
  "capabilities-about": {
    cam: [[2.6, 0.9, -47.5], [-1.6, 0.2, -54]],
    look: [[1.2, 1.1, -53], [-3.1, 0.4, -57]],
  },
  "about-contact": {
    cam: [[-2.2, 0.1, -63.2], [0.6, 0.2, -67.4]],
    look: [[0.4, 0.2, -68], [3.4, 0.12, -70]],
  },
};

export function destinationById(id: string): IDestination | undefined {
  return DESTINATIONS.find((item) => item.id === id);
}

export function destinationIndex(id: string): number {
  return DESTINATIONS.findIndex((item) => item.id === id);
}
