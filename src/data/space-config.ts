import type {
  IConstellationLink,
  INamedStar,
  IPlanetMaterialConfig,
  ISpaceSectionState,
  TSpaceQuality,
} from "@/types/space";
import type { TSectionId } from "@/types/portfolio";

export const STAR_COUNTS: Record<TSpaceQuality, number> = {
  desktop: 850,
  tablet: 450,
  mobile: 180,
};

export const SPACE_DPR: Record<TSpaceQuality, [number, number] | number> = {
  desktop: [1, 1.5],
  tablet: [1, 1.25],
  mobile: 1,
};

export const SHOOTING_STAR_MS = { min: 30_000, max: 70_000 } as const;

export const SECTION_STATES: Record<TSectionId, ISpaceSectionState> = {
  hero: {
    cameraPosition: [-0.15, 0.38, 8.6],
    cameraTarget: [3.35, 0.1, -0.2],
    starIntensity: 1,
    namedStarOpacity: 0.52,
    orbitOpacity: 0.78,
    ambientColor: "#0a101c",
    foregroundDensity: 1,
    planetEmphasis: "core",
    intensity: 1,
  },
  work: {
    cameraPosition: [1.35, 0.55, 7.6],
    cameraTarget: [4.05, 0.28, -2.4],
    starIntensity: 0.86,
    namedStarOpacity: 0.42,
    orbitOpacity: 0.7,
    ambientColor: "#09101b",
    foregroundDensity: 0.82,
    planetEmphasis: "work",
    intensity: 0.75,
  },
  experience: {
    cameraPosition: [0.9, 0.15, 8.2],
    cameraTarget: [3.55, -0.55, -3.8],
    starIntensity: 0.72,
    namedStarOpacity: 0.34,
    orbitOpacity: 0.55,
    ambientColor: "#080e18",
    foregroundDensity: 0.6,
    planetEmphasis: "experience",
    intensity: 0.5,
  },
  capabilities: {
    cameraPosition: [1.1, 0.85, 8.8],
    cameraTarget: [3.7, 0.85, -6.4],
    starIntensity: 0.78,
    namedStarOpacity: 0.28,
    orbitOpacity: 0.62,
    ambientColor: "#09111c",
    foregroundDensity: 0.68,
    planetEmphasis: "capabilities",
    intensity: 0.65,
  },
  about: {
    cameraPosition: [0.6, 0.4, 10.4],
    cameraTarget: [3.2, 0.15, -9.2],
    starIntensity: 0.62,
    namedStarOpacity: 0.38,
    orbitOpacity: 0.32,
    ambientColor: "#070c16",
    foregroundDensity: 0.42,
    planetEmphasis: "about",
    intensity: 0.45,
  },
  contact: {
    cameraPosition: [1.4, -0.35, 7.2],
    cameraTarget: [5.6, -2.4, -5.4],
    starIntensity: 0.42,
    namedStarOpacity: 0.18,
    orbitOpacity: 0.12,
    ambientColor: "#060a12",
    foregroundDensity: 0.22,
    planetEmphasis: "contact",
    intensity: 0.25,
  },
};

export const CORE_POSITION: [number, number, number] = [3.55, 0.12, -0.35];

export const WORK_PLANET: IPlanetMaterialConfig = {
  radius: 1.18,
  position: [4.15, 0.22, -3.15],
  baseColor: "#15233f",
  rimColor: "#6d8fff",
  roughness: 0.72,
  emissive: "#1c335f",
  emissiveIntensity: 0.22,
  atmosphereColor: "#4f7cff",
  atmosphereScale: 1.045,
  atmosphereOpacity: 0.16,
  rotationSpeed: 0.018,
};

export const EXPERIENCE_PLANET: IPlanetMaterialConfig = {
  radius: 0.98,
  position: [3.7, -0.72, -5.4],
  baseColor: "#121826",
  rimColor: "#7a8cff",
  roughness: 0.78,
  emissive: "#182238",
  emissiveIntensity: 0.14,
  atmosphereColor: "#6e7cff",
  atmosphereScale: 1.05,
  atmosphereOpacity: 0.12,
  rotationSpeed: 0.012,
};

export const ABOUT_PLANET: IPlanetMaterialConfig = {
  radius: 0.82,
  position: [3.35, 0.08, -10.6],
  baseColor: "#10151f",
  rimColor: "#5f8aa8",
  roughness: 0.84,
  emissive: "#151c28",
  emissiveIntensity: 0.1,
  atmosphereColor: "#4f7c9a",
  atmosphereScale: 1.06,
  atmosphereOpacity: 0.14,
  rotationSpeed: 0.008,
};

export const CONTACT_HORIZON: IPlanetMaterialConfig = {
  radius: 5.4,
  position: [7.6, -6.4, -7.2],
  baseColor: "#0c1422",
  rimColor: "#4f7cff",
  roughness: 0.9,
  emissive: "#13203a",
  emissiveIntensity: 0.18,
  atmosphereColor: "#4f7cff",
  atmosphereScale: 1.03,
  atmosphereOpacity: 0.2,
  rotationSpeed: 0.004,
};

export const CAPABILITY_BODIES = [
  { id: "frontends", color: "#4f7cff", radius: 0.22, distance: 1.15, speed: 0.22 },
  { id: "apis", color: "#50cfe6", radius: 0.16, distance: 1.62, speed: 0.16 },
  { id: "quality", color: "#816eff", radius: 0.14, distance: 2.05, speed: 0.12 },
] as const;

export const WORK_MOONS = [
  { id: "product-scale", color: "#8aa8ff", distance: 1.85, size: 0.09, speed: 0.28 },
  { id: "international", color: "#c9d4ff", distance: 2.28, size: 0.075, speed: 0.2 },
  { id: "bunyan", color: "#50cfe6", distance: 2.72, size: 0.07, speed: 0.15 },
] as const;

export const NAMED_STARS: INamedStar[] = [
  {
    id: "polaris",
    name: "POLARIS",
    catalog: "α UMi",
    position: [2.6, 4.15, -9.4],
    chapters: ["hero", "contact"],
  },
  {
    id: "sirius",
    name: "SIRIUS",
    catalog: "α CMa",
    position: [-3.8, 2.05, -7.2],
    chapters: ["hero"],
  },
  {
    id: "vega",
    name: "VEGA",
    catalog: "α Lyr",
    position: [6.4, 2.7, -8.8],
    chapters: ["work"],
  },
  {
    id: "deneb",
    name: "DENEB",
    catalog: "α Cyg",
    position: [7.6, 3.9, -12.4],
    chapters: ["work"],
  },
  {
    id: "altair",
    name: "ALTAIR",
    catalog: "α Aql",
    position: [5.35, 0.85, -10.1],
    chapters: ["work"],
  },
  {
    id: "rigel",
    name: "RIGEL",
    catalog: "β Ori",
    position: [6.8, -1.15, -9.6],
    chapters: ["experience"],
  },
  {
    id: "betelgeuse",
    name: "BETELGEUSE",
    catalog: "α Ori",
    position: [5.4, 0.55, -11.2],
    chapters: ["experience"],
  },
  {
    id: "arcturus",
    name: "ARCTURUS",
    catalog: "α Boo",
    position: [6.1, 2.35, -16.4],
    chapters: ["about"],
  },
  {
    id: "capella",
    name: "CAPELLA",
    catalog: "α Aur",
    position: [2.4, 3.55, -15.2],
    chapters: ["about"],
  },
  {
    id: "antares",
    name: "ANTARES",
    catalog: "α Sco",
    position: [8.4, -1.8, -14.6],
    chapters: ["capabilities"],
  },
  {
    id: "aldebaran",
    name: "ALDEBARAN",
    catalog: "α Tau",
    position: [3.15, -1.4, -13.8],
    chapters: ["capabilities"],
  },
  {
    id: "procyon",
    name: "PROCYON",
    catalog: "α CMi",
    position: [-1.6, 2.4, -8.5],
    chapters: ["about"],
  },
];

export const CONSTELLATION_LINKS: IConstellationLink[] = [
  { from: "vega", to: "deneb", chapters: ["work"] },
  { from: "deneb", to: "altair", chapters: ["work"] },
  { from: "vega", to: "altair", chapters: ["work"] },
  { from: "rigel", to: "betelgeuse", chapters: ["experience"] },
];

export const STAR_COLORS = [
  "#BFD7FF",
  "#E4EDFF",
  "#F4F4F0",
  "#F4F4F0",
  "#F4F4F0",
  "#F6E8C8",
  "#E7A58A",
] as const;

export const CAMERA_DAMPING = 2.15;
export const POINTER_STRENGTH = { x: 0.22, y: 0.14 };
