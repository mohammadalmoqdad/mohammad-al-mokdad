"use client";

import { DESTINATIONS } from "@/data/journey";
import { useJourneyUi } from "@/hooks/use-journey-ui";
import { cn, scrollToSection } from "@/lib/utils";

const PATH =
  "M18 12 C 32 38, 32 50, 32 64 C 20 90, 8 100, 8 116 C 20 142, 32 152, 32 168 C 20 194, 8 204, 8 220 C 20 244, 32 256, 32 268";

const NODE_Y = [12, 64, 116, 168, 220, 268];

export function JourneyMap() {
  const ui = useJourneyUi();
  const progress = ui.t / 5;

  return (
    <>
      <nav
        aria-label="Journey"
        className="pointer-events-none fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 xl:block"
      >
        <div className="pointer-events-auto relative h-[286px] w-14">
          <svg viewBox="0 0 40 280" className="h-full w-full" aria-hidden="true">
            <path
              d={PATH}
              fill="none"
              stroke="rgba(241,241,241,0.16)"
              strokeWidth="1"
            />
            <path
              d={PATH}
              fill="none"
              stroke="rgba(241,241,241,0.72)"
              strokeWidth="1.2"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - progress}
            />
          </svg>
          <ol className="absolute inset-0">
            {DESTINATIONS.map((item) => {
              const y = NODE_Y[item.index];
              const x =
                item.side === "left" ? 8 : item.side === "center" ? 18 : 32;
              const current = Math.round(ui.t) === item.index;
              return (
                <li
                  key={item.id}
                  className="absolute"
                  style={{ top: y, left: x }}
                >
                  <button
                    type="button"
                    className="group relative -translate-x-1/2 -translate-y-1/2"
                    aria-current={current ? "location" : undefined}
                    aria-label={`${item.planetLabel} · ${item.professionalLabel}`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    <span
                      className={cn(
                        "block h-2 w-2 rounded-full border border-silver bg-ink",
                        current && "h-2.5 w-2.5 bg-paper",
                      )}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-full mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-sm border border-line bg-ink/90 px-2 py-1 font-mono text-[0.58rem] tracking-[0.14em] text-muted uppercase group-hover:block group-focus-visible:block">
                      {item.planetLabel} · {item.professionalLabel}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
      <div
        className="pointer-events-none fixed top-[6.85rem] right-0 left-0 z-30 h-px origin-left bg-paper/25 lg:top-[3.65rem] xl:hidden"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
    </>
  );
}
