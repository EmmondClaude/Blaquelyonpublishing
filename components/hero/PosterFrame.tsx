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
 * When the real PNG lands, drop it in as an <img> over this frame (it stays as the
 * backdrop/poster) and the label can be removed.
 */
export function PosterFrame({
  label,
  soul = "emmondv2",
  note,
  aspect = "aspect-[4/5]",
  children,
}: {
  label: string;
  soul?: "Emmond" | "emmondv2";
  note?: string;
  aspect?: string;
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

      {/* The Higgsfield handoff stamp — unmistakable in the static pass */}
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-ej-gold-dim/30 bg-ej-noir/70 px-4 py-3 backdrop-blur-sm">
        <span className="font-mono text-[0.65rem] uppercase tracking-label text-ej-gold">
          {label}
        </span>
        <span className="font-mono text-[0.6rem] uppercase tracking-label text-ej-smoke">
          Higgsfield · soul:&nbsp;{soul}
        </span>
      </figcaption>

      {note ? (
        <span className="pointer-events-none absolute left-4 top-4 max-w-[70%] font-mono text-[0.6rem] leading-relaxed text-ej-smoke/80">
          {note}
        </span>
      ) : null}
    </figure>
  );
}
