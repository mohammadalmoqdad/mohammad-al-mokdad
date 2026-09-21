import { CatmullRomCurve3, Vector3 } from "three";
import {
  DESTINATIONS,
  LAST_DESTINATION,
  TRANSFER_WAYPOINTS,
} from "@/data/journey";
import { clamp } from "@/lib/math";
import type { TVec3 } from "@/types/space";

function vec(value: TVec3, xScale: number): Vector3 {
  return new Vector3(value[0] * xScale, value[1], value[2]);
}

function segmentPoints(
  kind: "cam" | "look",
  fromIndex: number,
  xScale: number,
): Vector3[] {
  const from = DESTINATIONS[fromIndex];
  const to = DESTINATIONS[fromIndex + 1];
  const start = kind === "cam" ? from.rest.cam : from.rest.look;
  const end = kind === "cam" ? to.rest.cam : to.rest.look;
  const extra = TRANSFER_WAYPOINTS[`${from.id}-${to.id}`]?.[kind] ?? [];
  return [
    vec(start, xScale),
    ...extra.map((point) => vec(point, xScale)),
    vec(end, xScale),
  ];
}

export function buildJourneyCurves(xScale: number): {
  cam: CatmullRomCurve3[];
  look: CatmullRomCurve3[];
} {
  const cam: CatmullRomCurve3[] = [];
  const look: CatmullRomCurve3[] = [];

  for (let index = 0; index < LAST_DESTINATION; index += 1) {
    const camCurve = new CatmullRomCurve3(
      segmentPoints("cam", index, xScale),
      false,
      "centripetal",
    );
    const lookCurve = new CatmullRomCurve3(
      segmentPoints("look", index, xScale),
      false,
      "centripetal",
    );
    camCurve.arcLengthDivisions = 160;
    lookCurve.arcLengthDivisions = 160;
    cam.push(camCurve);
    look.push(lookCurve);
  }

  return { cam, look };
}

export function sampleSegment(
  segments: CatmullRomCurve3[],
  t: number,
  xScale: number,
  kind: "cam" | "look",
  target: Vector3,
): void {
  const i = Math.min(Math.floor(t), LAST_DESTINATION);
  const f = t - i;
  const dest = DESTINATIONS[i];
  const rest = kind === "cam" ? dest.rest.cam : dest.rest.look;
  if (i >= LAST_DESTINATION || f <= 0.0001) {
    target.set(rest[0] * xScale, rest[1], rest[2]);
    return;
  }
  segments[i]?.getPointAt(clamp(f, 0, 1), target);
}
