"use client";

import { SECTION_IDS, SECTION_LABELS } from "@/data/portfolio";
import { usePortfolio } from "@/hooks/use-portfolio";
import { cn, scrollToSection } from "@/lib/utils";

export function OrbitalNav() {
  const { activeSection } = usePortfolio();

  return (
    <nav
      aria-label="Section progress"
      className="pointer-events-none fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="pointer-events-auto space-y-3">
        {SECTION_IDS.map((id) => {
          const active = activeSection === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => scrollToSection(id)}
                className="group flex items-center justify-end gap-3"
                aria-current={active ? "location" : undefined}
              >
                <span
                  className={cn(
                    "font-mono text-[0.62rem] tracking-[0.16em] text-muted uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                    active && "text-paper opacity-100",
                  )}
                >
                  {SECTION_LABELS[id].replace(/^\d+\s\/\s/, "")}
                </span>
                <span
                  className={cn(
                    "block h-1.5 w-1.5 rounded-full border border-line bg-transparent transition-all duration-200",
                    active && "h-2 w-2 border-accent bg-accent",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
