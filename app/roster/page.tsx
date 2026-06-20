import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/ui/Section";
import { PosterFrame } from "@/components/hero/PosterFrame";
import { roster } from "@/lib/content";

export const metadata: Metadata = {
  title: "Roster",
  description:
    "The artists and writers of Blaque Lyon Publishing — card grid into artist detail.",
};

/**
 * /roster — card grid of artists/writers, each linking to a detail page.
 */
export default function RosterPage() {
  return (
    <>
      <PageHeader
        kicker="Roster"
        title={
          <>
            The writers in
            <br />
            <span className="italic text-ej-gold-bright">the room.</span>
          </>
        }
        lead="Artists and writers on the house. Each card opens a full profile — bio, selected works, links."
      />

      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {roster.map((artist) => (
            <Link
              key={artist.slug}
              href={`/roster/${artist.slug}`}
              className="ej-card group block overflow-hidden"
            >
              <PosterFrame
                label={`ROSTER · ${artist.name}`}
                soul={artist.slug === "emmond-j-smith" ? "Emmond" : "emmondv2"}
                aspect="aspect-[4/5]"
              />
              <div className="p-6">
                <p className="font-display text-2xl font-light text-ej-bone transition-colors group-hover:text-ej-gold-bright">
                  {artist.name}
                </p>
                <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-label text-ej-smoke">
                  {artist.role} · {artist.city}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
