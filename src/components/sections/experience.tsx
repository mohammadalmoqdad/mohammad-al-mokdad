"use client";

import { SECTION_LABELS, portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/hooks/use-portfolio";
import { RESUME_DOWNLOAD_NAME } from "@/lib/utils";
import type { IExperienceCopyProps } from "@/types/ui";

export function ExperienceSection() {
  const { activeExperienceId, setActiveExperienceId } = usePortfolio();

  return (
    <section
      id="experience"
      className="relative z-10 min-h-[120svh] px-5 py-24 sm:px-8 lg:px-12"
    >
      <div className="mx-auto grid max-w-[76rem] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="text-veil lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="kicker">{SECTION_LABELS.experience}</p>
            <h2 className="display mt-5 text-[clamp(2.2rem,6vw,4.2rem)]">
              {portfolio.experience.headline}
            </h2>
            <p className="measure mt-6 text-pretty text-lg text-muted">
              {portfolio.experience.body}
            </p>
            <div className="mt-8 hidden lg:block">
              <Button
                href={portfolio.experience.resumeCta.href}
                variant="secondary"
                download={RESUME_DOWNLOAD_NAME}
              >
                {portfolio.experience.resumeCta.label}
              </Button>
            </div>
          </Reveal>
        </div>

        <div>
          <ol className="space-y-10">
            {portfolio.experience.items.map((item) => (
              <ExperienceItem
                key={item.id}
                item={item}
                isActive={activeExperienceId === item.id}
                onActivate={() => setActiveExperienceId(item.id)}
              />
            ))}
          </ol>
          <div className="mt-10 lg:hidden">
            <Button
              href={portfolio.experience.resumeCta.href}
              variant="secondary"
              download={RESUME_DOWNLOAD_NAME}
            >
              {portfolio.experience.resumeCta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({
  item,
  isActive,
  onActivate,
}: IExperienceCopyProps & { onActivate: () => void }) {
  const compact = item.visualWeight === "secondary";

  return (
    <li
      onPointerEnter={onActivate}
      onFocus={onActivate}
      className={compact ? "opacity-80" : undefined}
    >
      <Reveal>
        {compact ? (
          <p className="kicker mb-2">Earlier</p>
        ) : (
          <p className="font-mono text-[0.72rem] tracking-[0.12em] text-muted">
            {item.period}
          </p>
        )}
        <h3 className="mt-1 font-display text-[clamp(1.35rem,2.2vw,1.7rem)] tracking-[-0.04em]">
          {item.role}
          <span className="text-muted"> · {item.company}</span>
        </h3>
        {compact ? (
          <p className="mt-1 text-sm text-muted">{item.period}</p>
        ) : null}
        <p
          className={`mt-4 max-w-[62ch] text-pretty ${
            isActive ? "text-paper/90" : "text-muted"
          }`}
        >
          {item.summary}
        </p>
        {item.detail ? (
          <p className="mt-3 max-w-[62ch] text-pretty text-muted">{item.detail}</p>
        ) : null}
        {item.highlight ? (
          <p className="mt-4 max-w-[62ch] text-sm">
            <span className="kicker mr-2 text-[0.62rem]">
              {item.highlightLabel}
            </span>
            <span className="text-muted">{item.highlight}</span>
          </p>
        ) : null}
        {item.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.65rem] text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </Reveal>
    </li>
  );
}
