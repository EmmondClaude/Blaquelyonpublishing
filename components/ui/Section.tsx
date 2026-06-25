import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Static-pass layout primitives. Server Components, no JS. The kinetic mask/split
 * reveals from kinetic-type.md layer onto these in the motion pass — the real text
 * is always here in the DOM first (the cardinal rule), so that's additive.
 */

export function Section({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
}) {
  return <Tag className={`ej-container py-20 sm:py-28 ${className}`}>{children}</Tag>;
}

/**
 * The editorial page header — a kicker label, one oversized serif statement set
 * alone, and an optional short line of support. Acres of space is the luxury signal.
 */
export function PageHeader({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: ReactNode;
  lead?: string;
}) {
  return (
    <header className="ej-container pt-20 sm:pt-28">
      <Reveal as="div">
        <span className="ej-label">{kicker}</span>
      </Reveal>
      <Reveal
        as="div"
        delayMs={80}
        className="mt-6 max-w-4xl font-display text-5xl font-light leading-[1.04] text-ej-bone sm:text-6xl lg:text-7xl"
      >
        <h1>{title}</h1>
      </Reveal>
      {lead ? (
        <Reveal
          as="div"
          delayMs={160}
          className="mt-8 max-w-prose text-lg leading-relaxed text-ej-cream"
        >
          <p>{lead}</p>
        </Reveal>
      ) : null}
      <hr className="ej-rule mt-14" />
    </header>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="ej-label">{children}</p>;
}
