import type { ReactNode } from "react";

/**
 * PosterFrame — the finished still where a Higgsfield render will live.
 *
 * This is NOT throwaway. Per performance-and-a11y.md the poster IS the deliverable
 * three ways: it paints first, it's the `prefers-reduced-motion` fallback, and it's
 * what the WebGL error boundary shows on context loss. So it has to be beautiful on
 * its own — it is, rendered purely in CSS from the `ej-*` ramp (nocturne ground +
 * gold spotlight + a vinyl-groove ring motif).
 *
 * The `soul` / `note` props stamp the exact Higgsfield handoff onto the frame so
 * the image pipeline is unambiguous: which soul ("Emmond" / "emmondv2"), what shot.
 *
 * Drop-in: when a render lands, pass `src` (a path under /public, e.g.
 * "/renders/hero-emmond.png"). The image covers the frame; the CSS still stays
 * behind it as the load/poster fallback, and the handoff stamp is replaced by the
 * image. No `src` → the labeled placeholder (the current static-pass state).
 */
export function PosterFrame({
  label,
  soul = "emmondv2",
  note,
  aspect = "aspect-[4/5]",
  src,
  alt,
  children,
}: {
  label: string;
  soul?: "Emmond" | "emmondv2";
  note?: string;
  aspect?: string;
  src?: string;
  alt?: string;
  children?: ReactNode;
}) {
  return (
    <figure
      className={`group relative isolate w-full overflow-hidden rounded-xl border border-ej-gold-dim/30 bg-ej-noir ${aspect}`}
    >
      {/* House nocturne ground */}
      <div className="absolute inset-0 bg-ej-nocturne" />
      {/* Warm gold spotlight — the single raking light */}
      <div className="absolute inset-0 bg-ej-spot animate-ej-glow" />

      {/* The Higgsfield render, once it lands — covers the still, which stays as
          the fallback behind it. */}
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? label}
          className="absolute inset-0 z-10 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}

      {/* Vinyl-groove motif — concentric gold rings, faint (the studio texture) */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-[0.18]"
        style={{
          background:
            "repeating-radial-gradient(circle at 50% 50%, rgba(201,162,75,0.35) 0px, rgba(201,162,75,0.35) 1px, transparent 1px, transparent 14px)",
        }}
      />

      {/* Optional foreground content (e.g. the hero headline overlays this) */}
      {children}

      {/* The Higgsfield handoff stamp — only while the slot is still a placeholder. */}
      {!src ? (
        <>
          <figcaption className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-ej-gold-dim/30 bg-ej-noir/70 px-4 py-3 backdrop-blur-sm">
            <span className="font-mono text-[0.65rem] uppercase tracking-label text-ej-gold">
              {label}
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-label text-ej-smoke">
              Higgsfield · soul:&nbsp;{soul}
            </span>
          </figcaption>

          {note ? (
            <span className="pointer-events-none absolute left-4 top-4 z-20 max-w-[70%] font-mono text-[0.6rem] leading-relaxed text-ej-smoke/80">
              {note}
            </span>
          ) : null}
        </>
      ) : null}
    </figure>
  );
}
