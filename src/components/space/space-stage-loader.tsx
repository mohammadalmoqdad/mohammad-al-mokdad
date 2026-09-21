"use client";

import dynamic from "next/dynamic";
import { SpaceFallback } from "@/components/space/fallback";

const SpaceStage = dynamic(
  () => import("@/components/space/space-stage").then((mod) => mod.SpaceStage),
  { ssr: false, loading: () => <SpaceFallback /> },
);

export function SpaceStageLoader() {
  return <SpaceStage />;
}
