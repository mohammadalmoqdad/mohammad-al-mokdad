"use client";

import { SECTION_LABELS, portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { usePortfolio } from "@/hooks/use-portfolio";
import type { ICapabilityBlockProps } from "@/types/ui";

export function CapabilitiesSection() {
  const { activeCapabilityId, setActiveCapabilityId } = usePortfolio();

  return (
    <section
      id="capabilities"
      className="relative z-10 min-h-[100svh] px-5 py-24 sm:px-8 lg:px-12"
    >
      <div className="text-veil mx-auto max-w-[76rem]">
        <Reveal>
          <p className="kicker">{SECTION_LABELS.capabilities}</p>
          <h2 className="display mt-5 text-[clamp(2.2rem,6vw,4.2rem)]">
            {portfolio.capabilities.headline}
          </h2>
          <p className="measure mt-6 text-pretty text-lg text-muted">
            {portfolio.capabilities.body}
          </p>
        </Reveal>
        <ul className="mt-12 grid gap-8 lg:max-w-3xl">
          {portfolio.capabilities.items.map((item) => (
            <CapabilityBlock
              key={item.id}
              item={item}
              isActive={activeCapabilityId === item.id}
              onActivate={() => setActiveCapabilityId(item.id)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function CapabilityBlock({
  item,
  isActive,
  onActivate,
}: ICapabilityBlockProps) {
  return (
    <li
      onPointerEnter={onActivate}
      onFocus={onActivate}
      className="border-t border-line pt-6"
    >
      <Reveal>
        <p className="kicker">{item.index}</p>
        <h3
          className={`mt-2 font-display text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.04em] ${
            isActive ? "text-paper" : "text-paper/90"
          }`}
        >
          {item.title}
        </h3>
        <p className="mt-3 max-w-[54ch] text-pretty text-muted">{item.summary}</p>
      </Reveal>
    </li>
  );
}
