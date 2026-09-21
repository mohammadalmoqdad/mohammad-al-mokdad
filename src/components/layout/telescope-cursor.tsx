"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useCoarsePointer,
  useIsMobile,
  useIsTablet,
  usePrefersReducedMotion,
} from "@/hooks/use-media";
import { useJourneyUi } from "@/hooks/use-journey-ui";
import { lerp } from "@/lib/math";
import { pointerUi, subscribePointerUi } from "@/lib/journey-store";
import type { TTelescopeCursorState } from "@/types/ui";

const NATIVE_SELECTOR =
  "input, textarea, select, [contenteditable], [contenteditable='true']";
const INSPECT_SELECTOR = "[data-cursor='inspect']";
const PLANET_SELECTOR = "[data-cursor='planet']";
const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], [role='link'], summary, .telescope-hit";
const TEXT_SELECTOR = "p, li, h1, h2, h3, h4, blockquote";

function readCursorState(node: EventTarget | null): TTelescopeCursorState {
  if (!(node instanceof Element)) {
    return "default";
  }
  if (node.closest(NATIVE_SELECTOR)) {
    return "native";
  }
  if (node.closest(PLANET_SELECTOR)) {
    return "planet";
  }
  if (node.closest(INSPECT_SELECTOR)) {
    return "inspect";
  }
  if (node.closest(INTERACTIVE_SELECTOR)) {
    return "interactive";
  }
  if (node.closest(TEXT_SELECTOR)) {
    return "text";
  }
  return "default";
}

export function TelescopeCursor() {
  const coarse = useCoarsePointer();
  const mobile = useIsMobile();
  const tablet = useIsTablet();
  const ui = useJourneyUi();
  const prefersReduced = usePrefersReducedMotion();
  const [focused, setFocused] = useState(true);
  const enabled =
    !coarse &&
    !mobile &&
    !tablet &&
    !prefersReduced &&
    ui.quality !== "low" &&
    focused;
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [state, setState] = useState<TTelescopeCursorState>("default");
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);
  const lastMove = useRef(0);
  const loop = useRef<(now: number) => void>(() => undefined);

  useEffect(() => {
    loop.current = (now: number) => {
      const node = root.current;
      const pos = pointer.current;
      pos.x = lerp(pos.x, pos.tx, 0.35);
      pos.y = lerp(pos.y, pos.ty, 0.35);
      if (node) {
        node.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      const dist = Math.hypot(pos.x - pos.tx, pos.y - pos.ty);
      if (dist < 0.2 && now - lastMove.current > 250) {
        raf.current = 0;
        return;
      }
      raf.current = window.requestAnimationFrame((time) => loop.current(time));
    };
  }, []);

  useEffect(() => {
    const onFocus = () => setFocused(document.hasFocus());
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onFocus);
    onFocus();
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onFocus);
    };
  }, []);

  const handleMove = useCallback(() => {
    pointer.current.tx = pointerUi.clientX;
    pointer.current.ty = pointerUi.clientY;
    lastMove.current = performance.now();
    const next = readCursorState(pointerUi.target);
    setState((current) => (current === next ? current : next));
    setVisible(true);
    if (!raf.current) {
      raf.current = window.requestAnimationFrame((time) => loop.current(time));
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("telescope-cursor-on");
      if (raf.current) {
        window.cancelAnimationFrame(raf.current);
        raf.current = 0;
      }
      return;
    }
    document.documentElement.classList.add("telescope-cursor-on");
    const hide = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        setVisible(false);
      }
    };
    const unsub = subscribePointerUi(handleMove);
    document.addEventListener("pointerleave", hide);
    return () => {
      document.documentElement.classList.remove("telescope-cursor-on");
      unsub();
      document.removeEventListener("pointerleave", hide);
      if (raf.current) {
        window.cancelAnimationFrame(raf.current);
        raf.current = 0;
      }
    };
  }, [enabled, handleMove]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={root}
      className="telescope-cursor"
      data-state={state}
      data-visible={visible ? "true" : "false"}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" width="44" height="44">
        <defs>
          <filter id="telescope-keyline" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="0.55"
              floodColor="#050505"
              floodOpacity="0.9"
            />
          </filter>
        </defs>
        <g className="cursor-body" filter="url(#telescope-keyline)">
          <g className="cursor-tripod" fill="none" stroke="#C4C4C4" strokeWidth="1.7" strokeLinecap="round">
            <line x1="22" y1="26" x2="9" y2="44" />
            <line x1="22" y1="26" x2="35" y2="44" />
            <line x1="22" y1="26" x2="23.5" y2="45" strokeOpacity="0.75" />
          </g>
          <rect x="20.4" y="18" width="3.4" height="9" rx="0.8" fill="#A6A6A6" />
          <circle cx="22.1" cy="17.6" r="2.4" fill="#8E8E8E" />
          <g transform="rotate(32 5 6)">
            <rect className="cursor-tube" x="5" y="3.6" width="29" height="5.2" rx="1.3" fill="#EDEDED" />
            <rect x="5" y="2.9" width="9" height="6.6" rx="1.5" fill="#F7F7F7" />
            <rect x="31.2" y="4.3" width="5.4" height="3.6" rx="0.7" fill="#C2C2C2" />
            <rect x="18" y="1.7" width="7.2" height="2.1" rx="0.6" fill="#D4D4D4" />
            <circle cx="21.6" cy="1.5" r="1.15" fill="#B8B8B8" />
          </g>
          <circle cx="5" cy="6" r="3.05" fill="#0A0A0A" stroke="#FFFFFF" strokeWidth="1.15" />
        </g>
        <circle className="cursor-ring" cx="5" cy="6" r="9" fill="none" stroke="#F1F1F1" strokeWidth="0.9" />
        <circle className="cursor-ring-planet" cx="5" cy="6" r="12.5" fill="none" stroke="#F1F1F1" strokeWidth="0.7" />
        <circle className="cursor-dot" cx="5" cy="6" r="1.55" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
