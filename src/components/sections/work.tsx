"use client";

import { SECTION_LABELS, portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { ProjectModal } from "@/components/work/project-modal";
import { usePortfolio } from "@/hooks/use-portfolio";
import { isPlaceholder } from "@/lib/utils";
import type { IEarlierBuildCardProps, IProjectCardProps } from "@/types/ui";

export function WorkSection() {
  const {
    openProjectId,
    setOpenProjectId,
    activeWorkId,
    setActiveWorkId,
  } = usePortfolio();
  const openProject =
    portfolio.work.items.find((item) => item.id === openProjectId) ?? null;

  return (
    <section
      id="work"
      className="relative z-10 min-h-[130svh] px-5 py-24 sm:px-8 lg:px-12"
    >
      <div className="text-veil mx-auto max-w-[76rem]">
        <Reveal>
          <p className="kicker">{SECTION_LABELS.work}</p>
          <h2 className="display mt-5 text-[clamp(2.2rem,6vw,4.4rem)]">
            {portfolio.work.headline}
          </h2>
          <p className="measure mt-6 text-pretty text-lg text-muted">
            {portfolio.work.body}
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 lg:max-w-3xl">
          {portfolio.work.items.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.06}>
              <ProjectCard
                project={project}
                isActive={activeWorkId === project.id}
                onActivate={() => setActiveWorkId(project.id)}
                onOpen={() => setOpenProjectId(project.id)}
              />
            </Reveal>
          ))}
        </ul>

        <div id="earlier-builds" className="mt-16 max-w-3xl scroll-mt-28">
          <p className="kicker">{portfolio.work.earlierBuilds.label}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {portfolio.work.earlierBuilds.items.map((item) => (
              <EarlierBuildCard key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
      <ProjectModal
        project={openProject}
        onClose={() => setOpenProjectId(null)}
      />
    </section>
  );
}

function ProjectCard({
  project,
  onOpen,
  isActive,
  onActivate,
}: IProjectCardProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        onFocus={onActivate}
        onPointerEnter={onActivate}
        className={`surface surface-hover w-full p-5 text-left sm:p-6 ${
          isActive ? "border-line-hover" : ""
        }`}
      >
        <p className="kicker text-[0.65rem]">
          {project.index} / {project.subtitle}
        </p>
        <h3 className="mt-3 font-display text-[clamp(1.35rem,2.4vw,1.7rem)] tracking-[-0.04em]">
          {project.title}
        </h3>
        <p className="mt-3 max-w-[58ch] text-pretty text-muted">
          {project.summary}
        </p>
        <p className="mt-5 text-sm text-paper">
          Open case study
          <span aria-hidden="true"> →</span>
        </p>
      </button>
    </li>
  );
}

function EarlierBuildCard({ item }: IEarlierBuildCardProps) {
  const inner = (
    <>
      <h3 className="font-display text-lg tracking-[-0.03em]">{item.title}</h3>
      <p className="mt-2 text-sm text-muted">{item.summary}</p>
      {item.note ? (
        <p className="mt-3 font-mono text-[0.68rem] text-muted/80">{item.note}</p>
      ) : null}
    </>
  );

  if (item.href && !isPlaceholder(item.href)) {
    return (
      <li>
        <a
          href={item.href}
          className="surface surface-hover block h-full p-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          {inner}
        </a>
      </li>
    );
  }

  return <li className="surface h-full p-4">{inner}</li>;
}
