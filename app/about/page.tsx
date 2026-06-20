import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/ui/Section";
import { PosterFrame } from "@/components/hero/PosterFrame";
import { brand, accolades } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: `The story of ${brand.name} and ${brand.parent} — Las Vegas R&B publishing, ISC 2025 finalist, hits written behind the scenes.`,
};

/**
 * /about — lead with the editorial bio; accolades as a quiet, confident strip.
 * The ISC 2025 finalist nod and "hits for stars behind the scenes" live here as
 * the credits wall.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="About"
        title={
          <>
            A house built after
            <br />
            <span className="italic text-ej-gold-bright">midnight.</span>
          </>
        }
        lead={brand.description}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Editorial bio — long-form, the reading measure capped for luxury. */}
          <div className="max-w-prose space-y-6 text-lg leading-relaxed text-ej-cream">
            <p>
              <span className="font-display text-ej-bone">Emmond J Smith</span>{" "}
              writes R&B the way the Strip looks from a high floor at 2 a.m. —
              warm, low-lit, a little dangerous, and built to carry. He sits at
              the forefront of {brand.parent}, a Las Vegas publishing house that
              places songs, signs writers, and keeps a catalog moving.
            </p>
            <p>
              The work runs on two tracks at once: the records with his name on
              them, and the hits cut behind the scenes for artists you already
              know. (Placeholder copy — Emmond replaces this with the real bio
              and the named or NDA-safe credits.)
            </p>
            <p className="text-ej-smoke">
              This is the editorial bio slot. Keep it short, declarative, a
              little literary — the same restraint the rest of the site carries.
            </p>
            <div className="pt-4">
              <Link href="/publishing" className="ej-cta">
                Work with the house
              </Link>
            </div>
          </div>

          <PosterFrame
            label="ABOUT · portrait"
            soul="Emmond"
            aspect="aspect-[4/5]"
            note="Higgsfield: editorial portrait — studio texture, vinyl + single light. Quieter than the hero."
          />
        </div>
      </Section>

      {/* ── Accolades / credits wall ── */}
      <Section>
        <p className="ej-label">Accolades & Credits</p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-light text-ej-bone sm:text-4xl">
          Proof, kept quiet and confident.
        </h2>
        <div className="mt-12 divide-y divide-ej-gold-dim/20 border-y border-ej-gold-dim/20">
          {accolades.map((a) => (
            <div
              key={a.title}
              className="grid gap-4 py-8 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline"
            >
              <p className="font-display text-2xl font-light text-ej-gold-bright">
                {a.year}
              </p>
              <div>
                <p className="font-display text-xl text-ej-bone">{a.title}</p>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-ej-smoke">
                  {a.detail}
                </p>
              </div>
              {a.href ? (
                <a href={a.href} className="ej-link justify-self-start sm:justify-self-end">
                  Verify →
                </a>
              ) : (
                <span className="font-mono text-[0.7rem] uppercase tracking-label text-ej-ash">
                  On request
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
