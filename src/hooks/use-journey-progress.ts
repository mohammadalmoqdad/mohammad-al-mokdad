"use client";

import { useEffect } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import {
  DESTINATIONS,
  LAST_DESTINATION,
  REST_RATIO,
  destinationIndex,
} from "@/data/journey";
import {
  journey,
  notifyJourneyFrame,
  setJourneyProgress,
  setRootJourneyVars,
} from "@/lib/journey-store";
import { clamp, easeInOutCubic } from "@/lib/math";
import { usePrefersReducedMotion } from "@/hooks/use-media";

const anchors: number[] = new Array(DESTINATIONS.length).fill(0);
let applyQueued = false;
let pendingY = 0;

function headerOffset(): number {
  const header = document.querySelector("header");
  return header?.getBoundingClientRect().height ?? 88;
}

function measureAnchors(): void {
  const offset = headerOffset();
  DESTINATIONS.forEach((destination, index) => {
    const node = document.getElementById(destination.id);
    if (!node) {
      return;
    }
    const top = node.getBoundingClientRect().top + window.scrollY - offset;
    anchors[index] = Math.max(0, top);
  });
}

function applyScroll(y: number): void {
  let i = 0;
  for (let index = 0; index < LAST_DESTINATION; index += 1) {
    if (y >= (anchors[index + 1] ?? Number.POSITIVE_INFINITY)) {
      i = index + 1;
    }
  }
  i = Math.min(i, LAST_DESTINATION);
  const next = anchors[i + 1];
  const current = anchors[i] ?? 0;
  const span = Math.max(1, (next ?? current + window.innerHeight) - current);
  const raw = clamp((y - current) / span, 0, 1);

  if (journey.reducedMotion) {
    const snapped = raw < 0.5 ? i : Math.min(i + 1, LAST_DESTINATION);
    setJourneyProgress(snapped, 0, snapped, snapped);
    setRootJourneyVars();
    return;
  }

  const travel = raw <= REST_RATIO ? 0 : (raw - REST_RATIO) / (1 - REST_RATIO);
  const eased = easeInOutCubic(travel);
  const to = Math.min(i + 1, LAST_DESTINATION);
  setJourneyProgress(i + eased, Math.sin(eased * Math.PI), i, to);
  setRootJourneyVars();
}

function queueApplyScroll(y: number): void {
  pendingY = y;
  if (applyQueued) {
    return;
  }
  applyQueued = true;
  queueMicrotask(() => {
    applyQueued = false;
    applyScroll(pendingY);
  });
}

function snapToHash(hash: string, warpIfFar: boolean): void {
  const id = hash.replace("#", "") || "hero";
  const node = document.getElementById(id);
  if (!node) {
    return;
  }
  const to = destinationIndex(id);
  if (warpIfFar && to >= 0 && Math.abs(to - journey.t) > 1) {
    journey.warp = true;
  }
  journey.snap = true;
  const header = document.querySelector("header");
  const offset = header?.getBoundingClientRect().height ?? 76;
  const top = node.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  window.requestAnimationFrame(() => {
    measureAnchors();
    applyScroll(window.scrollY);
    journey.snap = true;
    journey.booted = true;
    notifyJourneyFrame();
  });
}

export function useJourneyProgress(): void {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    journey.reducedMotion = reduced;
  }, [reduced]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    journey.debug =
      process.env.NODE_ENV !== "production" &&
      params.get("debug") === "journey";

    const boot = () => {
      measureAnchors();
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        snapToHash(hash, false);
      } else {
        applyScroll(window.scrollY);
        journey.snap = true;
        journey.booted = true;
        notifyJourneyFrame();
      }
    };

    boot();
    window.requestAnimationFrame(boot);

    const observer = new ResizeObserver(() => {
      measureAnchors();
      queueApplyScroll(window.scrollY);
    });
    observer.observe(document.documentElement);
    DESTINATIONS.forEach((destination) => {
      const node = document.getElementById(destination.id);
      if (node) {
        observer.observe(node);
      }
    });

    const onResize = () => {
      measureAnchors();
      queueApplyScroll(window.scrollY);
    };
    window.addEventListener("resize", onResize);

    const onScrollEnd = () => {
      journey.warp = false;
      notifyJourneyFrame();
    };
    window.addEventListener("scrollend", onScrollEnd);

    const onPop = () => {
      snapToHash(window.location.hash, true);
    };
    window.addEventListener("popstate", onPop);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (value) => {
    queueApplyScroll(value);
  });
}
