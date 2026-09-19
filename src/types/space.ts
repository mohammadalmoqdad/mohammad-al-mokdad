import type { TSectionId } from "./portfolio";

export type TSpaceQuality = "desktop" | "tablet" | "mobile";

export type TSpaceEmphasis =
  | "core"
  | "work"
  | "experience"
  | "capabilities"
  | "about"
  | "contact";

export type TStarAnchorId =
  | "polaris"
  | "sirius"
  | "vega"
  | "deneb"
  | "altair"
  | "rigel"
  | "betelgeuse"
  | "arcturus"
  | "capella"
  | "antares"
  | "aldebaran"
  | "procyon";

export type TVec3 = [number, number, number];

export interface ISpaceSectionState {
  cameraPosition: TVec3;
  cameraTarget: TVec3;
  starIntensity: number;
  namedStarOpacity: number;
  orbitOpacity: number;
  ambientColor: string;
  foregroundDensity: number;
  planetEmphasis: TSpaceEmphasis;
  intensity: number;
}

export interface INamedStar {
  id: TStarAnchorId;
  name: string;
  catalog: string;
  position: TVec3;
  chapters: TSectionId[];
}

export interface IConstellationLink {
  from: TStarAnchorId;
  to: TStarAnchorId;
  chapters: TSectionId[];
}

export interface IPlanetMaterialConfig {
  radius: number;
  position: TVec3;
  baseColor: string;
  rimColor: string;
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
  atmosphereColor: string;
  atmosphereScale: number;
  atmosphereOpacity: number;
  rotationSpeed: number;
}

export interface ISpaceRuntime {
  pointerX: number;
  pointerY: number;
  section: TSectionId;
  workId: string;
  experienceId: string;
  capabilityId: string;
  reducedMotion: boolean;
  quality: TSpaceQuality;
}
