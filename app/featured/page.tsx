import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/ui/Section";
import { PosterFrame } from "@/components/hero/PosterFrame";
import { featuredSong } from "@/lib/content";

export const metadata: Metadata = {
  title: "Featured",
  description: `“${featuredSong.title}” by ${featuredSong.artist} — featured song, full credits and streaming links.`,
};

/**
 * /featured — the featured song page. Embedded player slot, songwriting credits,
 * streaming links, lyric tease. The player embed (Spotify/Apple/YouTube iframe or a
 * custom audio element) drops into the marked slot when Emmond supplies the track.
 */
export default function FeaturedPage() {
  return (
    <>
      <PageHeader
        kicker={`Featured · ${featuredSong.year}`}
        title={<>“{featuredSong.title}”</>}
        lead={`${featuredSong.artist} — the current featured record from the house.`}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Cover + player */}
          <div className="space-y-6">
            <PosterFrame
              label="FEATURED · cover art"
              soul="emmondv2"
              aspect="aspect-square"
              note="Higgsfield: single-cover composition. Replace with final cover art."
            />

            {/* Embedded player slot — iframe/audio drops in here. */}
            <div
              role="group"
              aria-label="Audio player (placeholder)"
              className="ej-card flex items-center gap-4 p-5"
            >
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-ej-gold/50 text-ej-gold-bright">
                ▶
              </span>
              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-label text-ej-smoke">
                  Player embed slot
                </p>
                <p className="text-sm text-ej-cream">
                  Spotify / Apple / YouTube iframe or custom audio element mounts
                  here.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {featuredSong.streaming.map((s) => (
                <a key={s.label} href={s.href} className="ej-cta">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Lyric tease + credits */}
          <div className="space-y-12">
            <div>
              <p className="ej-label">Lyric</p>
              <blockquote className="mt-5 max-w-prose font-display text-2xl font-light italic leading-relaxed text-ej-bone sm:text-3xl">
                {featuredSong.lyricTease.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </blockquote>
              <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-label text-ej-ash">
                Excerpt — full lyric on the streaming platforms.
              </p>
            </div>

            <div>
              <p className="ej-label">Credits</p>
              <dl className="mt-5 divide-y divide-ej-gold-dim/20 border-y border-ej-gold-dim/20">
                {featuredSong.credits.map((c) => (
                  <div
                    key={c.role}
                    className="flex items-baseline justify-between gap-6 py-3.5"
                  >
                    <dt className="font-mono text-[0.7rem] uppercase tracking-label text-ej-smoke">
                      {c.role}
                    </dt>
                    <dd className="text-right font-display text-lg text-ej-bone">
                      {c.name}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <Link href="/publishing" className="ej-link">
                License or sync this record →
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
