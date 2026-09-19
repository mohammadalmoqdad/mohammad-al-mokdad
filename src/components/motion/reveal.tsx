"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE_ASSEMBLE, REVEAL_DURATION } from "@/components/motion/motion-config";
import { useMotionProfile } from "@/hooks/use-motion-profile";
import type { IRevealProps } from "@/types/ui";

export function Reveal({ children, className, delay = 0 }: IRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.28, once: true });
  const profile = useMotionProfile();
  const play = profile !== "static" && inView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        play || profile === "static"
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 16 }
      }
      transition={{
        duration: profile === "static" ? 0 : REVEAL_DURATION,
        ease: EASE_ASSEMBLE,
        delay: play ? delay : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
