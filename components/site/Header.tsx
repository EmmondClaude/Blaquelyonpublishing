import Link from "next/link";
import { Wordmark } from "@/components/site/Wordmark";

const nav = [
  { href: "/about", label: "About" },
  { href: "/roster", label: "Roster" },
  { href: "/featured", label: "Featured" },
  { href: "/blog", label: "Journal" },
];

/**
 * Site header. Server Component — no motion in the static pass. The publishing CTA
 * is always present and keyboard-reachable (the brief's non-negotiable: the contact
 * action reachable with zero motion).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ej-gold-dim/20 bg-ej-ink/70 backdrop-blur-md">
      <div className="ej-container flex h-16 items-center justify-between">
        <Wordmark />

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-label text-ej-smoke transition-colors hover:text-ej-bone"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/publishing" className="ej-cta">
          Publishing
        </Link>
      </div>
    </header>
  );
}
