"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { portfolio } from "@/data/portfolio";
import { usePortfolio } from "@/hooks/use-portfolio";
import { copyToClipboard, isPlaceholder, mailtoHref, scrollToSection } from "@/lib/utils";
import type { TCommandItem } from "@/types/portfolio";

export function CommandPalette() {
  const { commandOpen, setCommandOpen } = usePortfolio();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  const items = useMemo(
    () =>
      portfolio.commands.filter((item) => {
        const haystack = `${item.label} ${item.hint}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      }),
    [query],
  );

  const closePalette = useCallback(() => {
    setCommandOpen(false);
    setQuery("");
    setActiveIndex(0);
    setCopied(false);
  }, [setCommandOpen]);

  const runCommand = useCallback(
    async (item: TCommandItem) => {
      if (item.action === "section") {
        const target = item.sectionId ?? item.href?.replace(/^#/, "");
        if (target) {
          scrollToSection(target);
        }
        closePalette();
        return;
      }

      if (item.action === "copy-email") {
        const ok = await copyToClipboard(portfolio.email);
        setCopied(ok);
        return;
      }

      if (item.action === "resume" && item.href) {
        window.open(item.href, "_blank", "noopener,noreferrer");
        closePalette();
        return;
      }

      if (item.action === "email") {
        window.location.href = mailtoHref(portfolio.email);
        closePalette();
        return;
      }

      if (item.action === "link" && item.href && !isPlaceholder(item.href)) {
        window.open(item.href, "_blank", "noopener,noreferrer");
        closePalette();
      }
    },
    [closePalette],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (commandOpen) {
          closePalette();
        } else {
          setCommandOpen(true);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePalette, commandOpen, setCommandOpen]);

  useEffect(() => {
    if (!commandOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePalette();
        previouslyFocused?.focus();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % Math.max(items.length, 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) =>
          (index - 1 + items.length) % Math.max(items.length, 1),
        );
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) {
          void runCommand(item);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, closePalette, commandOpen, items, runCommand]);

  if (!commandOpen) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/70 px-4 pt-[18vh] backdrop-blur-[12px]"
      onClick={closePalette}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.18 }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-title"
        className="w-full max-w-lg rounded-[var(--radius-md)] border border-line bg-ink-raised/95 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        <p id="command-title" className="kicker px-2 pb-2">
          Jump
        </p>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          placeholder="Work, experience, copy email…"
          className="w-full rounded-[var(--radius-sm)] border border-line bg-ink px-3 py-2.5 text-paper outline-none"
          aria-autocomplete="list"
          aria-controls="command-list"
        />
        <ul id="command-list" role="listbox" className="mt-2">
          {items.map((item, index) => (
            <li key={item.id} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm ${
                  index === activeIndex ? "bg-ink-panel text-paper" : "text-muted"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => void runCommand(item)}
              >
                <span>{item.label}</span>
                <span className="font-mono text-[0.7rem] text-muted">
                  {item.action === "copy-email" && copied ? "Copied" : item.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
