"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { EASE_ASSEMBLE, MODAL_DURATION } from "@/components/motion/motion-config";
import type { IModalBlockProps, IProjectModalProps } from "@/types/ui";

export function ProjectModal({ project, onClose }: IProjectModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!project) {
      return;
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus();
    };
  }, [onClose, project]);

  if (!project) {
    return null;
  }

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/75 p-3 sm:items-center sm:p-6"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="surface max-h-[88svh] w-full max-w-2xl overflow-y-auto bg-ink-soft p-5 sm:p-8"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : MODAL_DURATION, ease: EASE_ASSEMBLE }}
      >
        <p className="kicker">
          {project.index} / {project.subtitle}
        </p>
        <h3
          id={titleId}
          className="mt-3 font-display text-[clamp(1.5rem,4vw,1.9rem)] tracking-[-0.04em]"
        >
          {project.title}
        </h3>
        <dl className="mt-8 space-y-6">
          <ModalBlock term="Context" detail={project.context} />
          <ModalBlock term="What I worked on" detail={project.workedOn} />
          <ModalBlock term="Engineering challenges" detail={project.challenges} />
          <ModalBlock term="Stack" detail={project.stack.join(" / ")} />
        </dl>
        {project.note ? (
          <p className="mt-6 max-w-[62ch] text-sm text-muted/80">{project.note}</p>
        ) : null}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="mt-8 rounded-[var(--radius-sm)] border border-line px-4 py-2 text-sm text-paper hover:border-line-hover"
        >
          Close
        </button>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function ModalBlock({ term, detail }: IModalBlockProps) {
  return (
    <div>
      <dt className="kicker text-[0.65rem]">{term}</dt>
      <dd className="mt-2 max-w-[62ch] text-pretty text-muted">{detail}</dd>
    </div>
  );
}
