"use client";

import {
  useCallback,
  useRef,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import { cn, isExternalHref, scrollToSection } from "@/lib/utils";
import { useCoarsePointer, usePrefersReducedMotion } from "@/hooks/use-media";
import type { IButtonProps, TButtonVariant } from "@/types/ui";

const VARIANT_CLASS: Record<TButtonVariant, string> = {
  primary: "bg-paper text-ink hover:bg-white",
  secondary:
    "border border-line bg-transparent text-paper hover:border-line-hover hover:bg-white/5",
  ghost: "text-muted hover:text-paper",
};

export function Button({
  variant = "primary",
  href,
  external,
  magnetic = false,
  download,
  className,
  children,
  onClick,
  ...props
}: IButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const enableMagnet = magnetic && !reduced && !coarse;
  const openExternal = external ?? (href ? isExternalHref(href) : false);

  const reset = useCallback(() => {
    const node = ref.current;
    if (node) {
      node.style.transform = "translate3d(0,0,0)";
    }
  }, []);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!enableMagnet) {
        return;
      }
      const node = ref.current;
      if (!node) {
        return;
      }
      const rect = node.getBoundingClientRect();
      const x = Math.max(-8, Math.min(8, (event.clientX - rect.left - rect.width / 2) * 0.2));
      const y = Math.max(-8, Math.min(8, (event.clientY - rect.top - rect.height / 2) * 0.2));
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    [enableMagnet],
  );

  const handleAnchorClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
      if (event.defaultPrevented || !href?.startsWith("#")) {
        return;
      }
      event.preventDefault();
      scrollToSection(href.slice(1));
    },
    [href, onClick],
  );

  const classes = cn(
    "inline-flex max-w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 py-3 text-[0.92rem] font-medium tracking-[-0.01em] transition-[transform,background-color,border-color,color] duration-200 hover:-translate-y-px [&_svg]:transition-transform hover:[&_svg]:translate-x-1 will-change-transform sm:px-5 sm:text-[0.95rem]",
    VARIANT_CLASS[variant],
    className,
  );

  if (href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        target={openExternal ? "_blank" : undefined}
        rel={openExternal ? "noopener noreferrer" : undefined}
        download={download}
        onClick={handleAnchorClick}
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
        onBlur={reset}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      className={classes}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      onClick={onClick as ((event: MouseEvent<HTMLButtonElement>) => void) | undefined}
      {...props}
    >
      {children}
    </button>
  );
}
