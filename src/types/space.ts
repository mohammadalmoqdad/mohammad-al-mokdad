import type { Texture } from "three";
import type { TSectionId } from "./portfolio";

export type TSpaceQuality = "high" | "medium" | "low";

export type TPlanetId =
  | "core"
  | "jupiter"
  | "saturn"
  | "mars"
  | "neptune"
  | "earth"
  | "luna";

export type TPlanetSide = "center" | "left" | "right";

export type TVec3 = [number, number, number];

export interface IDestination {
  id: TSectionId;
  index: number;
  planet: TPlanetId;
  planetLabel: string;
  professionalLabel: string;
  sectionLabel: string;
  side: TPlanetSide;
  planetPos: TVec3;
  radius: number;
  rest: {
    cam: TVec3;
    look: TVec3;
  };
}

export interface ITransferWaypoints {
  cam: TVec3[];
  look: TVec3[];
}

export interface IJourneyState {
  t: number;
  transit: number;
  velocity: number;
  from: number;
  to: number;
  warp: boolean;
  snap: boolean;
  reducedMotion: boolean;
  quality: TSpaceQuality;
  pointerX: number;
  pointerY: number;
  workId: string;
  experienceId: string;
  capabilityId: string;
  debug: boolean;
  telescopeAim: number;
  lensFocus: number;
  telescopeVisible: number;
  textureResolution: string;
  booted: boolean;
}

export interface ISkyStar {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  size: number;
}

export interface IConstellation {
  id: string;
  name: string;
  stars: ISkyStar[];
  lines: Array<[string, string]>;
  named: string[];
}

export interface ISkyPlacement {
  tMid: number;
  yawDeg: number;
  pitchDeg: number;
  angularSizeDeg: number;
}

export interface ISkyWindow {
  tStart: number;
  tEnd: number;
  peakOpacity: number;
}

export interface ISkyLayerCounts {
  sphereField: number;
  corridorMid: number;
  corridorNear: number;
  heroStars: number;
  galaxies: number;
}

export interface IStarLayerProps {
  count: number;
  seed: number;
  attenuate: boolean;
  parallax: number;
  depthTest: boolean;
}

export interface ISkyLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface ISkyStats {
  field: number;
  fieldVisible: number;
  hero: number;
  heroVisible: number;
  galaxies: number;
  galaxyVisible: number;
}

export type TIdleJob = () => void;

export interface IStarCloudProps {
  data: IStarCloudData;
  attenuate: boolean;
  depthTest: boolean;
  map?: Texture | null;
  parallax: number;
  statKey?: "field" | "hero";
}

export interface IGalaxyCloudData {
  positions: Float32Array;
  sizes: Float32Array;
  alphas: Float32Array;
  rotations: Float32Array;
  atlas: Float32Array;
}

export interface IGalaxyShaderOptions {
  map: Texture;
}

export interface IConstellationLinesProps {
  item: IConstellation;
  xScale: number;
}

export interface ISkyLabelCandidate extends ISkyLabel {
  weight: number;
}

export interface IMonoPlanetProps {
  destination: IDestination;
  xScale: number;
}

export interface IEngineeringCoreProps {
  xScale: number;
}

export interface IStarShaderOptions {
  attenuate: boolean;
  depthTest: boolean;
  map?: Texture | null;
}

export interface IStarCloudData {
  positions: Float32Array;
  sizes: Float32Array;
  brights: Float32Array;
  tints: Float32Array;
  twinkles: Float32Array;
}

export interface IStarFieldProps {
  quality: TSpaceQuality;
}

export interface ISpaceSceneProps {
  quality: TSpaceQuality;
}

export interface IJourneyDebugSnap {
  t: number;
  transit: number;
  velocity: number;
  from: number;
  to: number;
  warp: boolean;
  quality: TSpaceQuality;
  fps: number;
  telescopeAim: number;
  lensFocus: number;
  telescopeVisible: number;
  textureResolution: string;
  fieldVisible: number;
  heroVisible: number;
  galaxyVisible: number;
}

export interface IPlanetRadiusProps {
  radius: number;
}

export interface ITelescopeProps {
  xScale: number;
}

export interface IPlanetCompileShader {
  fragmentShader: string;
}

export interface IPlanetLook {
  rim: string;
  atmosphere: string;
  roughness: number;
  atmosphereOpacity: number;
  metalness: number;
  normalScale: number;
  bumpScale: number;
  tilt: TVec3;
  frameShift: TVec3;
}

export interface IPlanetSurfaceMaps {
  albedo: HTMLCanvasElement;
  normal: HTMLCanvasElement;
  roughness: HTMLCanvasElement;
  bump: HTMLCanvasElement;
}

export interface IPlanetLightRig {
  position: TVec3;
  intensity: number;
  color: string;
}
