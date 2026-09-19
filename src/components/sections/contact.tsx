"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { SECTION_LABELS, portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { copyToClipboard, isPlaceholder, mailtoHref } from "@/lib/utils";
import type { IContactPathProps } from "@/types/ui";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(copiedTimer.current);
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(portfolio.email);
    setCopied(ok);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section
      id="contact"
      className="relative z-10 min-h-[90svh] px-5 py-24 sm:px-8 lg:px-12"
    >
      <div className="text-veil mx-auto max-w-[76rem]">
        <Reveal>
          <p className="kicker">{SECTION_LABELS.contact}</p>
          <h2 className="display mt-5 max-w-4xl text-[clamp(2.4rem,7vw,4.6rem)]">
            {portfolio.contact.headline}
          </h2>
          <p className="measure mt-6 text-pretty text-lg text-muted">
            {portfolio.contact.body}
          </p>
        </Reveal>
        <ul className="mt-10 grid min-w-0 gap-4 sm:grid-cols-2 lg:max-w-3xl">
          {portfolio.contact.paths.map((path) => (
            <ContactPathCard
              key={path.id}
              path={path}
              email={portfolio.email}
            />
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" onClick={() => void handleCopy()}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? "Email copied" : "Copy email"}
          </Button>
          <Button href={portfolio.whatsappUrl} variant="ghost">
            WhatsApp
          </Button>
        </div>
        <a
          className="mt-8 inline-block text-base text-paper underline decoration-accent/40 underline-offset-4"
          href={mailtoHref(portfolio.email)}
        >
          {portfolio.email}
        </a>
        <ul className="mt-8 flex flex-wrap gap-5 text-sm">
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
    </section>
  );
}

function ContactPathCard({ path, email }: IContactPathProps) {
  return (
    <li>
      <a
        href={mailtoHref(email, path.subject, path.mailBody)}
        className="surface surface-hover group block p-5 sm:p-6"
      >
        <p className="font-display text-[clamp(1.4rem,3vw,1.85rem)] tracking-[-0.04em]">
          {path.title}
        </p>
        <p className="mt-2 text-muted">{path.body}</p>
        <p className="mt-5 text-sm text-paper">
          {path.cta}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 group-hover:translate-x-1"
          >
            {" "}
            →
          </span>
        </p>
      </a>
    </li>
  );
}
