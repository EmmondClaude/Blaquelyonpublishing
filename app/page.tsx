import Link from "next/link";
import { PosterFrame } from "@/components/hero/PosterFrame";
import { ReactiveHero } from "@/components/hero/ReactiveHero";
import { Section } from "@/components/ui/Section";
import { brand, accolades, featuredSong, roster } from "@/lib/content";

/**
 * Home — the cinematic front door. Emmond at the forefront, one editorial
 * statement, the primary CTA to publishing contact.
 *
 * STATIC-FIRST: the hero is a PosterFrame (the finished still + reduced-motion
 * fallback). The reactive R3F hero and the single pinned scroll beat (the Lacoste-
 * style chaptered reveal of Emmond / "Neon Confession") mount HERE in the 3D pass,
 * behind this exact poster. Nothing below changes shape when they land.
 */
export default function HomePage() {
  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative ej-container pt-16 sm:pt-24">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="ej-label animate-ej-rise">
              {brand.city} · R&B Publishing
            </p>
            <h1 className="mt-6 font-display text-6xl font-light leading-[0.98] text-ej-bone animate-ej-rise sm:text-7xl lg:text-8xl">
              Neon
              <br />
              <span className="italic text-ej-gold-bright">confessions,</span>
              <br />
              written down.
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ej-cream animate-ej-rise">
              {brand.tagline} A Las Vegas publishing house with{" "}
              <span className="text-ej-bone">Emmond J Smith</span> at the
              forefront — placing songs, building writers, moving the catalog.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5 animate-ej-rise">
              <Link href="/publishing" className="ej-cta">
                Inquire for publishing
              </Link>
              <Link href="/featured" className="ej-link">
                Hear the featured song →
              </Link>
            </div>
          </div>

          {/* The reactive hero — a live spinning vinyl, gated behind a poster
              fallback for reduced-motion / no-WebGL. The Higgsfield "Emmond"
              portrait composites in (or becomes the pinned scroll beat) next. */}
          <ReactiveHero />
        </div>

        {/* The one pinned scroll beat (Lacoste-style reveal) mounts here next. */}
        <p className="mt-16 font-mono text-[0.7rem] uppercase tracking-label text-ej-ash animate-ej-glow">
          ↓ Scroll — the one beat (Lacoste-style reveal) mounts here next pass
        </p>
      </section>

      {/* ─────────────────────── ACCOLADES STRIP ─────────────────────── */}
      <Section>
        <p className="ej-label">Accolades</p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-ej-gold-dim/30 bg-ej-gold-dim/20 sm:grid-cols-3">
          {accolades.map((a) => (
            <div key={a.title} className="bg-ej-ink/80 p-7">
              <p className="font-display text-3xl font-light text-ej-gold-bright">
                {a.year}
              </p>
              <p className="mt-3 font-display text-lg text-ej-bone">{a.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ej-smoke">
                {a.detail}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/about" className="ej-link">
            The full story →
          </Link>
        </div>
      </Section>

      {/* ─────────────────────── FEATURED SONG ─────────────────────── */}
      <Section className="!py-16">
        <div className="ej-card overflow-hidden">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <PosterFrame
              label="FEATURED · cover"
              soul="emmondv2"
              aspect="aspect-square"
              note="Higgsfield: single-cover composition for “Neon Confession.”"
            />
            <div>
              <p className="ej-label">Featured Song</p>
              <h2 className="mt-4 font-display text-4xl font-light text-ej-bone sm:text-5xl">
                “{featuredSong.title}”
              </h2>
              <p className="mt-3 font-mono text-xs uppercase tracking-label text-ej-smoke">
                {featuredSong.artist} · {featuredSong.year}
              </p>
              <p className="mt-6 max-w-md font-display text-lg italic leading-relaxed text-ej-cream">
                {featuredSong.lyricTease.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <div className="mt-8">
                <Link href="/featured" className="ej-cta">
                  Open the featured page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─────────────────────── ROSTER TEASER ─────────────────────── */}
      <Section>
        <div className="flex items-end justify-between">
          <div>
            <p className="ej-label">The Roster</p>
            <h2 className="mt-4 font-display text-4xl font-light text-ej-bone sm:text-5xl">
              Writers in the room.
            </h2>
          </div>
          <Link href="/roster" className="ej-link hidden sm:inline-flex">
            All artists →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
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
              <div className="p-5">
                <p className="font-display text-xl text-ej-bone transition-colors group-hover:text-ej-gold-bright">
                  {artist.name}
                </p>
                <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-label text-ej-smoke">
                  {artist.role}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ─────────────────────── CLOSING CTA ─────────────────────── */}
      <Section className="text-center">
        <hr className="ej-rule mb-16" />
        <p className="ej-label">Get in contact</p>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-light leading-tight text-ej-bone sm:text-6xl">
          Have a song, a writer, or a placement in mind?
        </h2>
        <div className="mt-10 flex justify-center">
          <Link href="/publishing" className="ej-cta">
            Start a publishing inquiry
          </Link>
        </div>
      </Section>
    </>
  );
}
