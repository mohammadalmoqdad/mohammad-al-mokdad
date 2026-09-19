"use client";

import { useEffect } from "react";
import { SECTION_IDS } from "@/data/portfolio";
import type { TSectionId } from "@/types/portfolio";

function resolveActiveSection(): TSectionId {
  const marker = window.scrollY + window.innerHeight * 0.32;
  let current: TSectionId = "hero";

  SECTION_IDS.forEach((id) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    const top = element.getBoundingClientRect().top + window.scrollY;
    if (top <= marker) {
      current = id;
    }
  });

  return current;
}

export function useSectionObserver(onChange: (id: TSectionId) => void): void {
  useEffect(() => {
    const sync = () => {
      onChange(resolveActiveSection());
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onChange]);
}
