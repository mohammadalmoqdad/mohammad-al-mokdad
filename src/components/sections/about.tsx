"use client";

import { SECTION_LABELS, portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";
import type { IStackGroupProps } from "@/types/ui";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 min-h-[100svh] px-5 py-24 sm:px-8 lg:px-12"
    >
      <div className="text-veil mx-auto max-w-[76rem]">
        <Reveal>
          <p className="kicker">{SECTION_LABELS.about}</p>
          <h2 className="display mt-5 max-w-4xl text-[clamp(2.1rem,5.4vw,4rem)]">
            {portfolio.about.headline}
          </h2>
        </Reveal>
        <div className="mt-8 max-w-[46rem] space-y-5 text-pretty text-lg text-muted">
          {portfolio.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-3 lg:max-w-4xl">
          {portfolio.about.principles.map((principle) => (
            <li key={principle.id}>
              <h3 className="font-display text-xl tracking-[-0.03em]">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{principle.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-16">
          <p className="kicker">Selected stack</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-3 lg:max-w-4xl">
            {portfolio.about.stack.map((group) => (
              <StackGroup key={group.id} group={group} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StackGroup({ group }: IStackGroupProps) {
  return (
    <div>
      <h3 className="text-sm text-paper">{group.title}</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        {group.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
