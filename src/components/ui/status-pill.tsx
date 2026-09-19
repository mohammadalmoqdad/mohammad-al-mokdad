import { portfolio } from "@/data/portfolio";
import type { IStatusPillProps } from "@/types/ui";

export function StatusPill({ label }: IStatusPillProps) {
  return (
    <p className="inline-flex max-w-full items-center gap-2 rounded-[10px] border border-line bg-ink-panel/80 px-3 py-2 text-sm leading-5 text-muted">
      <span className="status-dot shrink-0" aria-hidden="true" />
      <span className="min-w-0 text-pretty">{label || portfolio.status}</span>
    </p>
  );
}
