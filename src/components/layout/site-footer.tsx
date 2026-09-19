"use client";

import { portfolio } from "@/data/portfolio";
import { isPlaceholder } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-transparent px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[76rem] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg tracking-[-0.04em]">{portfolio.name}</p>
          <p className="text-sm text-muted">{portfolio.role}</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a className="text-muted hover:text-paper" href={`mailto:${portfolio.email}`}>
            Email
          </a>
          {portfolio.social.map((item) =>
            isPlaceholder(item.href) ? (
              <span key={item.label} className="text-muted/70">
                {item.label}
              </span>
            ) : (
              <a
                key={item.label}
                className="text-muted hover:text-paper"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ),
          )}
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-[76rem] font-mono text-[0.68rem] tracking-[0.14em] text-muted uppercase">
        {portfolio.footerNote}
      </p>
    </footer>
  );
}
