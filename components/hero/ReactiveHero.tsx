"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PosterFrame } from "@/components/hero/PosterFrame";
import { WebGLErrorBoundary } from "@/components/hero/WebGLErrorBoundary";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// Client-only — three crashes SSR. The loading state IS the poster, so there's no
// flash of empty canvas; the poster paints instantly and the vinyl fades in over it.
const VinylCanvas = dynamic(() => import("@/components/hero/VinylCanvas"), {
  ssr: false,
  loading: () => <HeroPoster />,
});

/** The shared poster — the still the canvas sits on, and the fallback for all three
 *  switch-offs (reduced motion, no WebGL, context loss). Same chrome as the live frame. */
function HeroPoster() {
  return (
    <PosterFrame
      label="HERO · Emmond portrait"
      soul="Emmond"
      aspect="aspect-[4/5]"
      note="Higgsfield handoff: single raking light, three-quarter pose, oxblood/gold nocturne, clean-silhouette PNG on a void ground (doubles as poster + cut-out + 3D source)."
    />
  );
}

/**
 * Move #1, gated. Reduced-motion visitors get the static poster and never boot the
 * canvas; everyone else gets the spinning vinyl on the same nocturne ground, inside
 * an error boundary that falls back to the poster if WebGL dies.
 */
export function ReactiveHero() {
  const reduced = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);

  if (reduced || failed) return <HeroPoster />;

  return (
    <WebGLErrorBoundary fallback={<HeroPoster />}>
      <figure className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-xl border border-ej-gold-dim/30 bg-ej-noir">
        {/* House nocturne ground + raking spotlight — the same world as the poster */}
        <div className="absolute inset-0 bg-ej-nocturne" />
        <div className="absolute inset-0 bg-ej-spot" />

        {/* The live record */}
        <VinylCanvas onContextLost={() => setFailed(true)} />

        {/* Caption stamp — live variant */}
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-ej-gold-dim/30 bg-ej-noir/60 px-4 py-3 backdrop-blur-sm">
          <span className="font-mono text-[0.65rem] uppercase tracking-label text-ej-gold">
            Now spinning · live
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-label text-ej-smoke">
            Move your cursor
          </span>
        </figcaption>
      </figure>
    </WebGLErrorBoundary>
  );
}
