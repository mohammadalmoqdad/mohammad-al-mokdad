"use client";

import { useEffect, useState } from "react";
import { portfolio } from "@/data/portfolio";
import { usePortfolio } from "@/hooks/use-portfolio";
import { cn, RESUME_DOWNLOAD_NAME, scrollToSection } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/ui/monogram";

export function SiteHeader() {
  const { activeSection, setCommandOpen } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200",
        scrolled
          ? "border-b border-line bg-[var(--nav-scrolled)] backdrop-blur-[16px]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[76rem] items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-12">
        <a
          href="#hero"
          className="flex min-w-0 items-center gap-3 text-paper"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("hero");
          }}
        >
          <Monogram className="h-8 w-8 shrink-0 text-paper" decorative />
          <span className="hidden truncate font-display text-sm tracking-[-0.04em] xl:inline">
            {portfolio.name}
          </span>
          <span className="font-display text-sm tracking-[-0.04em] xl:hidden">
            {portfolio.shortName}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-3 lg:flex xl:gap-5">
          {portfolio.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "relative shrink-0 text-[0.8125rem] text-muted transition-colors duration-200 hover:text-paper xl:text-sm",
                activeSection === item.sectionId && "text-paper",
              )}
              aria-current={
                activeSection === item.sectionId ? "location" : undefined
              }
              onClick={(event) => {
                if (!item.sectionId || !item.href.startsWith("#")) {
                  return;
                }
                event.preventDefault();
                scrollToSection(item.sectionId);
              }}
            >
              {item.label}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-200",
                  activeSection === item.sectionId && "scale-x-100",
                )}
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden rounded-[var(--radius-sm)] border border-line px-2.5 py-1.5 font-mono text-[0.68rem] text-muted lg:inline-flex"
            onClick={() => setCommandOpen(true)}
            aria-keyshortcuts="Meta+K Control+K"
          >
            ⌘K
          </button>
          <Button
            href={portfolio.resumePath}
            variant="secondary"
            className="px-3 py-2 text-sm whitespace-nowrap"
            download={RESUME_DOWNLOAD_NAME}
          >
            Résumé
          </Button>
        </div>
      </div>

      <nav
        aria-label="Mobile"
        className="flex gap-4 overflow-x-auto border-t border-line px-5 py-2 lg:hidden"
      >
        {portfolio.nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap text-sm text-muted",
              activeSection === item.sectionId && "text-paper",
            )}
            aria-current={
              activeSection === item.sectionId ? "location" : undefined
            }
            onClick={(event) => {
              if (!item.sectionId || !item.href.startsWith("#")) {
                return;
              }
              event.preventDefault();
              scrollToSection(item.sectionId);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
