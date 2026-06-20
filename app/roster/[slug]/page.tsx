import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PosterFrame } from "@/components/hero/PosterFrame";
import { roster } from "@/lib/content";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return roster.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const artist = roster.find((a) => a.slug === params.slug);
  if (!artist) return { title: "Roster" };
  return {
    title: artist.name,
    description: `${artist.name} — ${artist.role}, ${artist.city}. ${artist.bio}`,
  };
}

export default function RosterArtistPage({ params }: Params) {
  const artist = roster.find((a) => a.slug === params.slug);
  if (!artist) notFound();

  return (
    <>
      <header className="ej-container pt-20 sm:pt-28">
        <Link href="/roster" className="ej-link">
          ← Roster
        </Link>
      </header>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <PosterFrame
            label={`ROSTER · ${artist.name}`}
            soul={artist.slug === "emmond-j-smith" ? "Emmond" : "emmondv2"}
            aspect="aspect-[4/5]"
            note="Higgsfield: artist portrait, same nocturne lighting as the house."
          />

          <div>
            <p className="ej-label">{artist.role}</p>
            <h1 className="mt-4 font-display text-5xl font-light text-ej-bone sm:text-6xl">
              {artist.name}
            </h1>
            <p className="mt-3 font-mono text-xs uppercase tracking-label text-ej-smoke">
              {artist.city}
            </p>

            <p className="mt-8 max-w-prose text-lg leading-relaxed text-ej-cream">
              {artist.bio}
            </p>

            <div className="mt-12">
              <p className="ej-label">Selected works</p>
              <ul className="mt-5 space-y-3 border-t border-ej-gold-dim/20 pt-5">
                {artist.selectedWorks.map((work) => (
                  <li
                    key={work}
                    className="font-display text-lg text-ej-bone"
                  >
                    {work}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {artist.links.map((l) => (
                <a key={l.label} href={l.href} className="ej-cta">
                  {l.label}
                </a>
              ))}
              <Link href="/publishing" className="ej-link self-center">
                Work with this writer →
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
