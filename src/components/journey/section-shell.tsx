"use client";

import { destinationById } from "@/data/journey";
import { useJourneyUi } from "@/hooks/use-journey-ui";
import { cn } from "@/lib/utils";
import type { ISectionShellProps } from "@/types/ui";

export function SectionShell({ id, children }: ISectionShellProps) {
  const dest = destinationById(id);
  const ui = useJourneyUi();
  if (!dest) {
    return null;
  }

  const active = dest.index === ui.from || dest.index === ui.to;
  const opacity = active ? 1 - ui.transit * 0.48 : 0.28;
  const shift = active && ui.transit > 0.4 ? 16 : 0;
  const isLeft = dest.side === "left";
  const isRight = dest.side === "right" || dest.side === "center";

  return (
    <section
      id={id}
      data-side={dest.side}
      className={cn(
        "relative z-10 min-h-[118svh] scroll-mt-[7.25rem] px-5 pb-[32vh] pt-28 sm:px-8 lg:min-h-[128svh] lg:scroll-mt-[4.75rem] lg:px-12",
        id === "hero" && "flex min-h-[110svh] items-center pt-24",
        id === "contact" && "min-h-[100svh] pb-24",
      )}
    >
      <div
        className={cn(
          "relative w-full max-w-[42rem] transition-[opacity,transform] duration-300",
          isRight && "mr-auto",
          isLeft && "ml-auto",
        )}
        style={{
          opacity,
          transform: `translate3d(0, ${shift}px, 0)`,
        }}
      >
        <div className={cn("section-veil", isLeft && "section-veil-right")}>
          {children}
        </div>
      </div>
      <p
        className={cn(
          "pointer-events-none absolute top-[38%] hidden font-mono text-[0.68rem] tracking-[0.22em] text-silver/50 uppercase xl:block",
          isRight && "right-[8%]",
          isLeft && "left-[8%]",
        )}
        style={{
          opacity: dest.id === "work" && ui.t < 0.8 ? 0 : 1,
        }}
        aria-hidden="true"
      >
        <span className="block text-paper/70">{dest.planetLabel}</span>
        <span className="mt-1 block">{dest.sectionLabel}</span>
      </p>
      <div
        data-cursor="planet"
        className={cn(
          "absolute top-[18%] hidden h-[58%] w-[30%] xl:block",
          isRight && "right-0",
          isLeft && "left-0",
        )}
        aria-hidden="true"
      />
    </section>
  );
}
