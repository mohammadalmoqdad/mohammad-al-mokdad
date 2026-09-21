import { destinationIndex } from "@/data/journey";
import { journey, notifyJourneyFrame } from "@/lib/journey-store";

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function isPlaceholder(value: string): boolean {
  return /YOUR_[A-Z0-9_]+/.test(value);
}

export async function copyToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

export function mailtoHref(
  email: string,
  subject?: string,
  body?: string,
): string {
  const parts: string[] = [];
  if (subject) {
    parts.push(`subject=${encodeURIComponent(subject)}`);
  }
  if (body) {
    parts.push(`body=${encodeURIComponent(body)}`);
  }
  return parts.length > 0
    ? `mailto:${email}?${parts.join("&")}`
    : `mailto:${email}`;
}

export function scrollToSection(sectionId: string, instant = false): void {
  const node = document.getElementById(sectionId);
  if (!node) {
    return;
  }

  const from = Math.round(journey.t);
  const to = destinationIndex(sectionId);
  if (to >= 0 && Math.abs(to - from) > 1) {
    journey.warp = true;
  }

  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const header = document.querySelector("header");
  const offset = header?.getBoundingClientRect().height ?? 76;
  const top =
    node.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: instant || reduced ? "auto" : "smooth",
  });
  if (window.location.hash !== `#${sectionId}`) {
    window.history.pushState(null, "", `#${sectionId}`);
  }
  notifyJourneyFrame();
  window.setTimeout(() => {
    journey.warp = false;
    notifyJourneyFrame();
  }, 1600);
}

export function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

export const RESUME_DOWNLOAD_NAME = "Mohammad_Almokdad_Resume.pdf";

export const VISIBLE_TAG_LIMIT = 5;

let webglSupport: boolean | null = null;

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const n = Number.parseInt(value, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function detectWebGL(): boolean {
  if (webglSupport !== null) {
    return webglSupport;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    webglSupport = Boolean(gl);
    const lose = gl?.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return webglSupport;
  } catch {
    webglSupport = false;
    return false;
  }
}
