import { cn } from "@/lib/utils";
import type { IMonogramProps } from "@/types/ui";

export function Monogram({
  className,
  title = "Mohammad Almokdad",
  decorative = false,
}: IMonogramProps) {
  return (
    <svg
      className={cn("h-8 w-8", className)}
      viewBox="0 0 40 40"
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
    >
      {decorative ? null : <title>{title}</title>}
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M10 30V10l10 12 10-12v20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
