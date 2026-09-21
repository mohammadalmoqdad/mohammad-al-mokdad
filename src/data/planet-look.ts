import type {
  IPlanetLightRig,
  IPlanetLook,
  TPlanetId,
} from "@/types/space";

export const PLANET_LOOK: Record<Exclude<TPlanetId, "core">, IPlanetLook> = {
  jupiter: {
    rim: "#b8a888",
    atmosphere: "#7a6c58",
    roughness: 0.72,
    atmosphereOpacity: 0.045,
    metalness: 0.02,
    normalScale: 0.12,
    bumpScale: 0.008,
    tilt: [0.32, 0.58, 0.08],
    frameShift: [0.12, 0.04, 0],
  },
  saturn: {
    rim: "#c8b898",
    atmosphere: "#a09074",
    roughness: 0.7,
    atmosphereOpacity: 0.04,
    metalness: 0.03,
    normalScale: 0.1,
    bumpScale: 0.006,
    tilt: [0.22, -0.55, 0.08],
    frameShift: [-0.28, 0.08, 0],
  },
  mars: {
    rim: "#b07a62",
    atmosphere: "#5a3228",
    roughness: 0.9,
    atmosphereOpacity: 0.035,
    metalness: 0.01,
    normalScale: 0.32,
    bumpScale: 0.022,
    tilt: [0.36, 0.42, -0.12],
    frameShift: [0.22, 0.1, 0],
  },
  neptune: {
    rim: "#8aa0b8",
    atmosphere: "#5c738c",
    roughness: 0.38,
    atmosphereOpacity: 0.1,
    metalness: 0.05,
    normalScale: 0.08,
    bumpScale: 0.004,
    tilt: [0.28, -0.48, 0.08],
    frameShift: [-0.32, -0.06, 0],
  },
  earth: {
    rim: "#7a96b0",
    atmosphere: "#4a6a88",
    roughness: 0.58,
    atmosphereOpacity: 0.1,
    metalness: 0.06,
    normalScale: 0.38,
    bumpScale: 0.028,
    tilt: [0.28, 0.85, 0.06],
    frameShift: [0.35, 0.06, 0],
  },
  luna: {
    rim: "#c8c4bc",
    atmosphere: "#6a6864",
    roughness: 0.96,
    atmosphereOpacity: 0.02,
    metalness: 0.01,
    normalScale: 0.7,
    bumpScale: 0.05,
    tilt: [0.4, 0.7, -0.1],
    frameShift: [0.2, 0.05, 0],
  },
};

export const PLANET_AMBIENT = 0.04;

export const PLANET_HEMI_SKY = "#7a7a7a";
export const PLANET_HEMI_GROUND = "#050505";
export const PLANET_HEMI_INTENSITY = 0.055;

export const PLANET_KEY_LIGHT: IPlanetLightRig = {
  position: [-5.2, 6.4, 9.2],
  intensity: 0.95,
  color: "#f3eee4",
};

export const PLANET_FILL_LIGHT: IPlanetLightRig = {
  position: [8.5, -2.4, -5],
  intensity: 0.1,
  color: "#6d7e96",
};
