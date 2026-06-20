import Link from "next/link";
import { brand } from "@/lib/content";

/**
 * The wordmark. Editorial-luxury register: the name in the display serif with a
 * thin gold accent — Cartier restraint, not a logo lockup. The real logo/wordmark
 * asset from Emmond drops in here later.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${brand.name} — home`}
      className={`group inline-flex items-baseline gap-2 ${className}`}
    >
      <span className="font-display text-lg font-medium tracking-wordmark text-ej-bone transition-colors group-hover:text-ej-gold-bright">
        EMMOND
      </span>
      <span aria-hidden className="h-3 w-px translate-y-[1px] bg-ej-gold" />
      <span className="font-mono text-[0.7rem] uppercase tracking-label text-ej-gold">
        J Smith
      </span>
    </Link>
  );
}
