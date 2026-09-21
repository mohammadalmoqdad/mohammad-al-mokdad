"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { SECTION_LABELS, portfolio } from "@/data/portfolio";
import { SectionShell } from "@/components/journey/section-shell";
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
    <SectionShell id="contact">
      <Reveal>
        <p className="kicker">{SECTION_LABELS.contact}</p>
        <h2 className="display mt-5 text-[clamp(2.4rem,7vw,4.6rem)]">
          {portfolio.contact.headline}
        </h2>
        <p className="measure mt-6 text-pretty text-lg text-muted">
          {portfolio.contact.body}
        </p>
      </Reveal>
      <ul className="mt-10 grid min-w-0 gap-4 sm:grid-cols-2">
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
          <WhatsAppIcon />
          WhatsApp
        </Button>
      </div>
      <a
        className="mt-8 inline-block text-base text-paper underline decoration-paper/40 underline-offset-4"
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
    </SectionShell>
  );
}

function ContactPathCard({ path, email }: IContactPathProps) {
  return (
    <li className="h-full">
      <a
        href={mailtoHref(email, path.subject, path.mailBody)}
        className="surface surface-hover group flex h-full flex-col p-5 sm:p-6"
      >
        <p className="font-display text-[clamp(1.4rem,3vw,1.85rem)] tracking-[-0.04em]">
          {path.title}
        </p>
        <p className="mt-2 flex-1 text-muted">{path.body}</p>
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

function WhatsAppIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
