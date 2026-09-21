import type {
  IConstellation,
  ISkyLayerCounts,
  ISkyPlacement,
  ISkyStar,
  ISkyWindow,
  TSpaceQuality,
} from "@/types/space";

export const SKY_TINT = 1;
export const CELESTIAL_RADIUS = 90;
export const SKY_WARM = "#F4EAD8";
export const SKY_COOL = "#DDE6F5";

export const SKY_LAYER_COUNTS: Record<TSpaceQuality, ISkyLayerCounts> = {
  high: {
    sphereField: 2600,
    corridorMid: 420,
    corridorNear: 120,
    heroStars: 64,
    galaxies: 12,
  },
  medium: {
    sphereField: 1500,
    corridorMid: 260,
    corridorNear: 70,
    heroStars: 36,
    galaxies: 7,
  },
  low: {
    sphereField: 800,
    corridorMid: 120,
    corridorNear: 0,
    heroStars: 16,
    galaxies: 3,
  },
};

function star(
  id: string,
  name: string,
  x: number,
  y: number,
  size = 1,
): ISkyStar {
  return { id, name, x, y, z: 0, size };
}

function scaleHeight(stars: ISkyStar[], heightDeg: number): ISkyStar[] {
  const ys = stars.map((item) => item.y);
  const span = Math.max(...ys) - Math.min(...ys) || 1;
  const k = heightDeg / span;
  return stars.map((item) =>
    star(item.id, item.name, item.x * k, item.y * k, item.size),
  );
}

export const CONSTELLATIONS: IConstellation[] = [
  {
    id: "ursa-major",
    name: "URSA MAJOR",
    named: [],
    stars: scaleHeight(
      [
        star("dubhe", "Dubhe", -1.8, 1.6, 1.1),
        star("merak", "Merak", -1.35, 0.85, 1),
        star("phecda", "Phecda", -0.45, 0.7, 0.9),
        star("megrez", "Megrez", 0.05, 1.15, 0.75),
        star("alioth", "Alioth", 0.85, 1.35, 1.05),
        star("mizar", "Mizar", 1.55, 1.55, 1),
        star("alkaid", "Alkaid", 2.35, 1.15, 1.1),
      ],
      15,
    ),
    lines: [
      ["dubhe", "merak"],
      ["merak", "phecda"],
      ["phecda", "megrez"],
      ["megrez", "dubhe"],
      ["megrez", "alioth"],
      ["alioth", "mizar"],
      ["mizar", "alkaid"],
    ],
  },
  {
    id: "pegasus",
    name: "PEGASUS",
    named: [],
    stars: scaleHeight(
      [
        star("markab", "Markab", -1.1, 0.4, 1),
        star("scheat", "Scheat", -0.9, 1.55, 1.05),
        star("alpheratz", "Alpheratz", 0.95, 1.45, 1.1),
        star("algenib", "Algenib", 1.15, 0.25, 0.95),
      ],
      10,
    ),
    lines: [
      ["markab", "scheat"],
      ["scheat", "alpheratz"],
      ["alpheratz", "algenib"],
      ["algenib", "markab"],
    ],
  },
  {
    id: "orion",
    name: "ORION",
    named: ["betelgeuse", "rigel"],
    stars: scaleHeight(
      [
        star("betelgeuse", "BETELGEUSE", -1.15, 1.55, 1.45),
        star("bellatrix", "Bellatrix", 0.95, 1.45, 1.1),
        star("mintaka", "Mintaka", -0.55, 0.12, 0.95),
        star("alnilam", "Alnilam", 0.05, 0.05, 1.05),
        star("alnitak", "Alnitak", 0.62, -0.02, 0.95),
        star("saiph", "Saiph", -0.85, -1.35, 1),
        star("rigel", "RIGEL", 1.05, -1.45, 1.4),
      ],
      16,
    ),
    lines: [
      ["betelgeuse", "bellatrix"],
      ["betelgeuse", "mintaka"],
      ["bellatrix", "alnitak"],
      ["mintaka", "alnilam"],
      ["alnilam", "alnitak"],
      ["mintaka", "saiph"],
      ["alnitak", "rigel"],
      ["saiph", "rigel"],
    ],
  },
  {
    id: "taurus",
    name: "TAURUS",
    named: ["aldebaran"],
    stars: scaleHeight(
      [
        star("aldebaran", "ALDEBARAN", 0.15, 0.05, 1.35),
        star("elnath", "Elnath", 1.35, 1.2, 1.05),
        star("hyades-a", "Hyades", -0.55, 0.45, 0.7),
        star("hyades-b", "Hyades", -0.85, -0.15, 0.7),
        star("hyades-c", "Hyades", 0.55, -0.35, 0.7),
      ],
      12,
    ),
    lines: [
      ["aldebaran", "hyades-a"],
      ["aldebaran", "hyades-b"],
      ["aldebaran", "hyades-c"],
      ["hyades-a", "elnath"],
    ],
  },
  {
    id: "canis-major",
    name: "CANIS MAJOR",
    named: ["sirius"],
    stars: scaleHeight(
      [
        star("sirius", "SIRIUS", 0, 0.85, 1.6),
        star("mirzam", "Mirzam", -1.15, 0.35, 0.95),
        star("wehzen", "Wezen", 0.35, -0.55, 0.9),
        star("adhara", "Adhara", -0.35, -1.15, 1.05),
      ],
      9,
    ),
    lines: [
      ["sirius", "mirzam"],
      ["sirius", "wehzen"],
      ["wehzen", "adhara"],
    ],
  },
  {
    id: "leo",
    name: "LEO",
    named: ["regulus"],
    stars: scaleHeight(
      [
        star("regulus", "REGULUS", 0.15, -0.15, 1.25),
        star("algieba", "Algieba", -0.15, 1.05, 1),
        star("adhafera", "Adhafera", -0.85, 1.35, 0.8),
        star("rasalas", "Rasalas", -1.45, 1.15, 0.75),
        star("denebola", "Denebola", 2.05, 0.35, 1),
      ],
      13,
    ),
    lines: [
      ["rasalas", "adhafera"],
      ["adhafera", "algieba"],
      ["algieba", "regulus"],
      ["algieba", "denebola"],
    ],
  },
  {
    id: "scorpius",
    name: "SCORPIUS",
    named: ["antares"],
    stars: scaleHeight(
      [
        star("antares", "ANTARES", 0, 0.55, 1.4),
        star("graffias", "Graffias", -0.85, 1.25, 0.85),
        star("dschubba", "Dschubba", -0.35, 1.05, 0.85),
        star("shaula", "Shaula", 1.55, -1.15, 1.05),
        star("lesath", "Lesath", 1.25, -0.85, 0.8),
        star("tail", "Tail", 0.75, -0.25, 0.7),
      ],
      13,
    ),
    lines: [
      ["graffias", "dschubba"],
      ["dschubba", "antares"],
      ["antares", "tail"],
      ["tail", "lesath"],
      ["lesath", "shaula"],
    ],
  },
];

export const SKY_PLACEMENTS: Record<string, ISkyPlacement> = {
  polaris: { tMid: 0, yawDeg: 6, pitchDeg: 19, angularSizeDeg: 1.2 },
  "ursa-major": { tMid: 0, yawDeg: -22, pitchDeg: 11, angularSizeDeg: 15 },
  pegasus: { tMid: 0.5, yawDeg: -16, pitchDeg: 8, angularSizeDeg: 10 },
  vega: { tMid: 0.5, yawDeg: 24, pitchDeg: 17, angularSizeDeg: 1.2 },
  "galaxy-cluster": { tMid: 1.5, yawDeg: 12, pitchDeg: -4, angularSizeDeg: 10 },
  orion: { tMid: 2.5, yawDeg: -4, pitchDeg: 6, angularSizeDeg: 16 },
  taurus: { tMid: 3, yawDeg: -20, pitchDeg: 10, angularSizeDeg: 12 },
  "canis-major": { tMid: 3.5, yawDeg: 14, pitchDeg: -9, angularSizeDeg: 9 },
  leo: { tMid: 4.5, yawDeg: -18, pitchDeg: 12, angularSizeDeg: 13 },
  scorpius: { tMid: 4.5, yawDeg: 18, pitchDeg: -10, angularSizeDeg: 13 },
  "polaris-return": { tMid: 5, yawDeg: 8, pitchDeg: 20, angularSizeDeg: 1.2 },
};

export const FALLBACK_SKY_PLACEMENT: ISkyPlacement =
  SKY_PLACEMENTS.orion ?? {
    tMid: 2.5,
    yawDeg: -4,
    pitchDeg: 6,
    angularSizeDeg: 16,
  };

export const SKY_WINDOWS: Record<string, ISkyWindow> = {
  "ursa-major": { tStart: -0.4, tEnd: 1.15, peakOpacity: 0.72 },
  pegasus: { tStart: 0.15, tEnd: 1.65, peakOpacity: 0.7 },
  orion: { tStart: 1.85, tEnd: 3.25, peakOpacity: 0.78 },
  taurus: { tStart: 2.55, tEnd: 3.7, peakOpacity: 0.68 },
  "canis-major": { tStart: 2.95, tEnd: 4.25, peakOpacity: 0.68 },
  leo: { tStart: 3.55, tEnd: 5.35, peakOpacity: 0.7 },
  scorpius: { tStart: 3.55, tEnd: 5.35, peakOpacity: 0.7 },
};

export const HERO_STAR_IDS = [
  "polaris",
  "vega",
  "betelgeuse",
  "rigel",
  "sirius",
  "aldebaran",
  "antares",
  "regulus",
] as const;

export const HERO_STAR_PX: Record<string, number> = {
  sirius: 22,
  vega: 18,
  rigel: 18,
  betelgeuse: 18,
  polaris: 16,
  aldebaran: 14,
  antares: 14,
  regulus: 14,
};
