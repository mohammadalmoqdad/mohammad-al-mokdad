"use client";

import { ArrowDownRight } from "lucide-react";
import { SECTION_LABELS, portfolio } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { isPlaceholder } from "@/lib/utils";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-[100svh] items-center px-5 pt-28 pb-16 sm:px-8 lg:min-h-[110svh] lg:px-12"
    >
      <div className="mx-auto grid w-full max-w-[76rem] lg:grid-cols-[minmax(0,38rem)_minmax(12rem,1fr)]">
        <div className="text-veil min-w-0">
          <p className="kicker mb-5 sm:mb-6">{portfolio.hero.eyebrow}</p>
          <p className="mb-4 font-mono text-[0.68rem] tracking-[0.18em] text-muted/70">
            {SECTION_LABELS.hero}
          </p>
          <h1 className="display break-words text-[clamp(2.5rem,6.6vw,5.4rem)] text-paper">
            {portfolio.hero.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="measure mt-5 text-pretty text-[1.0625rem] leading-7 text-muted sm:mt-6 sm:text-lg">
            {portfolio.hero.body}
          </p>
          <div className="mt-6 flex max-w-full flex-wrap items-center gap-3 sm:mt-8">
            <Button href={portfolio.hero.primaryCta.href}>
              {portfolio.hero.primaryCta.label}
              <ArrowDownRight size={18} aria-hidden="true" />
            </Button>
            <Button href={portfolio.hero.secondaryCta.href} variant="secondary">
              {portfolio.hero.secondaryCta.label}
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <StatusPill label={portfolio.availability} />
          </div>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm">
            {portfolio.social.map((item) => (
              <li key={item.label}>
                {isPlaceholder(item.href) ? (
                  <span className="text-muted">{item.label}</span>
                ) : (
                  <a
                    href={item.href}
                    className="text-muted transition-colors hover:text-paper"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
