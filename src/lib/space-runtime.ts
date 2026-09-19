import type { TSectionId } from "@/types/portfolio";
import type { ISpaceRuntime, TSpaceQuality } from "@/types/space";

export const spaceRuntime: ISpaceRuntime = {
  pointerX: 0,
  pointerY: 0,
  section: "hero",
  workId: "product-scale",
  experienceId: "jo-academy",
  capabilityId: "frontends",
  reducedMotion: false,
  quality: "desktop",
};

export function setSpaceSection(section: TSectionId): void {
  spaceRuntime.section = section;
}

export function setSpaceQuality(quality: TSpaceQuality): void {
  spaceRuntime.quality = quality;
}
