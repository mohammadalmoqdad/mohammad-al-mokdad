import { Vector3 } from "three";
import { DESTINATIONS } from "@/data/journey";
import { CELESTIAL_RADIUS, SKY_COOL, SKY_TINT, SKY_WARM } from "@/data/sky";
import { buildJourneyCurves, sampleSegment } from "@/lib/curves";
import { clamp } from "@/lib/math";
import { hexToRgb } from "@/lib/utils";
import type { IDestination, ISkyPlacement } from "@/types/space";

const UP = new Vector3(0, 1, 0);
const CAM = new Vector3();
const LOOK = new Vector3();
const FORWARD = new Vector3();
const RIGHT = new Vector3();
const LIFTED = new Vector3();

function basisAt(tMid: number, xScale: number): {
  forward: Vector3;
  right: Vector3;
  up: Vector3;
} {
  const curves = buildJourneyCurves(xScale);
  sampleSegment(curves.cam, tMid, xScale, "cam", CAM);
  sampleSegment(curves.look, tMid, xScale, "look", LOOK);
  FORWARD.copy(LOOK).sub(CAM);
  if (FORWARD.lengthSq() < 0.0001) {
    FORWARD.set(0, 0, -1);
  } else {
    FORWARD.normalize();
  }
  RIGHT.crossVectors(FORWARD, UP);
  if (RIGHT.lengthSq() < 0.0001) {
    RIGHT.set(1, 0, 0);
  } else {
    RIGHT.normalize();
  }
  LIFTED.crossVectors(RIGHT, FORWARD).normalize();
  return {
    forward: FORWARD.clone(),
    right: RIGHT.clone(),
    up: LIFTED.clone(),
  };
}

export function skyPoint(
  placement: ISkyPlacement,
  xDeg: number,
  yDeg: number,
  xScale: number,
): Vector3 {
  const { forward, right, up } = basisAt(placement.tMid, xScale);
  const yaw = (placement.yawDeg * Math.PI) / 180;
  const pitch = (placement.pitchDeg * Math.PI) / 180;
  const dir = forward.clone().applyAxisAngle(up, yaw);
  dir.applyAxisAngle(right, pitch).normalize();
  dir.addScaledVector(right, Math.tan((xDeg * Math.PI) / 180));
  dir.addScaledVector(up, Math.tan((yDeg * Math.PI) / 180));
  return dir.normalize().multiplyScalar(CELESTIAL_RADIUS);
}

function restLookDir(destination: IDestination, xScale: number): Vector3 {
  const cam = new Vector3(
    destination.rest.cam[0] * xScale,
    destination.rest.cam[1],
    destination.rest.cam[2],
  );
  const look = new Vector3(
    destination.rest.look[0] * xScale,
    destination.rest.look[1],
    destination.rest.look[2],
  );
  return look.sub(cam).normalize();
}

function yawPitchFromForward(
  dir: Vector3,
  forward: Vector3,
): { yaw: number; pitch: number } {
  const right = new Vector3().crossVectors(forward, UP).normalize();
  const up = new Vector3().crossVectors(right, forward).normalize();
  const x = clamp(dir.dot(right), -1, 1);
  const y = clamp(dir.dot(up), -1, 1);
  const z = clamp(dir.dot(forward), -1, 1);
  return {
    yaw: (Math.atan2(x, z) * 180) / Math.PI,
    pitch: (Math.asin(y) * 180) / Math.PI,
  };
}

export function isInTextSafeCone(
  dir: Vector3,
  destination: IDestination,
  xScale: number,
): boolean {
  const forward = restLookDir(destination, xScale);
  const { yaw, pitch } = yawPitchFromForward(dir.clone().normalize(), forward);
  if (Math.abs(pitch) > 20) {
    return false;
  }
  if (destination.side === "left") {
    return yaw > 4 && yaw < 32;
  }
  if (destination.side === "right") {
    return yaw < -4 && yaw > -32;
  }
  return yaw > -26 && yaw < 8;
}

export function textSafeDestinations(): readonly IDestination[] {
  return DESTINATIONS;
}

export function pickStarTint(rand: () => number): [number, number, number] {
  if (SKY_TINT <= 0) {
    return [1, 1, 1];
  }
  const roll = rand();
  if (roll < 0.08 * SKY_TINT) {
    const [r, g, b] = hexToRgb(SKY_WARM);
    return [r / 255, g / 255, b / 255];
  }
  if (roll < 0.12 * SKY_TINT) {
    const [r, g, b] = hexToRgb(SKY_COOL);
    return [r / 255, g / 255, b / 255];
  }
  return [1, 1, 1];
}
