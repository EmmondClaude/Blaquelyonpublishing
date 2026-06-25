"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ScrollProgress } from "@/components/hero/vinyl";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const BeatCanvas = dynamic(() => import("@/components/beat/BeatCanvas"), {
  ssr: false,
  loading: () => <BeatGround />,
});

/** The four chapters of the reveal — the editorial captions that land on each beat. */
const CHAPTERS = [
  { kicker: "I · Approach", line: "A record, alone in the dark." },
  { kicker: "II · Detail", line: "The label catches gold." },
  { kicker: "III · The drop", line: "Neon bleeds across the grooves." },
  { kicker: "IV · Rest", line: "“Neon Confession.”" },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Per-chapter opacity across the scroll progress (0..1). The last chapter fades in
 *  and stays (the rest frame); the others fade in and out across their segment. */
function chapterOpacity(p: number, i: number, count: number) {
  const seg = 1 / count;
  const local = (p - i * seg) / seg;
  if (i === count - 1) return clamp(local / 0.35);
  if (local < 0 || local > 1) return 0;
  if (local < 0.35) return local / 0.35;
  if (local > 0.7) return clamp((1 - local) / 0.3);
  return 1;
}

/** The house ground for the beat — also the dynamic-import loading state. */
function BeatGround() {
  return (
    <div className="absolute inset-0 bg-ej-nocturne">
      <div className="absolute inset-0 bg-ej-spot" />
    </div>
  );
}

export function NeonConfessionBeat() {
  const reduced = usePrefersReducedMotion();
  const triggerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<ScrollProgress>({ progress: 0 });
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduced || failed) return;
    const trigger = triggerRef.current;
    if (!trigger) return;

    let cleanup = () => {};
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const writeOverlays = (p: number) => {
        chapterRefs.current.forEach((el, i) => {
          if (!el) return;
          const o = chapterOpacity(p, i, CHAPTERS.length);
          el.style.opacity = String(o);
          el.style.transform = `translateY(${(1 - o) * 18}px)`;
        });
        if (railRef.current)
          railRef.current.style.transform = `scaleX(${clamp(p)})`;
        if (hintRef.current)
          hintRef.current.style.opacity = String(clamp(1 - p / 0.12));
      };

      const st = ScrollTrigger.create({
        trigger,
        start: "top top",
        end: "+=320%", // the length of the pinned journey
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          progressRef.current.progress = self.progress;
          writeOverlays(self.progress);
        },
      });

      writeOverlays(0);
      // Pins are fragile until layout/fonts settle — refresh once ready.
      const refresh = () => ScrollTrigger.refresh();
      if (document.fonts?.ready) document.fonts.ready.then(refresh);
      requestAnimationFrame(refresh);

      cleanup = () => st.kill();
    })();

    return () => cleanup();
  }, [reduced, failed]);

  // ── Reduced-motion / no-WebGL fallback: the chapters as a calm stacked sequence,
  //    legible top-to-bottom with zero scroll-jacking (scroll-choreography.md). ──
  if (reduced) {
    return (
      <section aria-label="Neon Confession — the reveal" className="ej-container py-24">
        <p className="ej-label">The Drop</p>
        <div className="mt-10 space-y-12">
          {CHAPTERS.map((c) => (
            <div key={c.kicker} className="border-l border-ej-gold-dim/40 pl-6">
              <p className="font-mono text-[0.7rem] uppercase tracking-label text-ej-gold">
                {c.kicker}
              </p>
              <p className="mt-3 font-display text-3xl font-light text-ej-bone sm:text-4xl">
                {c.line}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link href="/featured" className="ej-cta">
            Open “Neon Confession”
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div
      ref={triggerRef}
      className="relative h-screen w-full overflow-hidden"
      aria-label="Neon Confession — the reveal"
    >
      <BeatGround />

      {failed ? (
        <BeatGround />
      ) : (
        <BeatCanvas progressRef={progressRef} onContextLost={() => setFailed(true)} />
      )}

      {/* Accessible, always-present text (the chapters live in the DOM for SEO/AT).
          Presentation is animated via the refs above; existence never is. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative ej-container text-center">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.kicker}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
              style={{ opacity: 0 }}
            >
              <p className="font-mono text-xs uppercase tracking-label text-ej-gold">
                {c.kicker}
              </p>
              <p className="mx-auto mt-5 max-w-2xl font-display text-4xl font-light leading-tight text-ej-bone sm:text-6xl">
                {c.line}
              </p>
              {i === CHAPTERS.length - 1 ? (
                <div className="pointer-events-auto mt-10 flex justify-center">
                  <Link href="/featured" className="ej-cta">
                    Open the featured song
                  </Link>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Progress rail — a thin gold line that fills across the journey. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-ej-gold-dim/30">
        <div
          ref={railRef}
          className="h-full origin-left bg-ej-gold-rule"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Scroll affordance — fades out as the journey starts. */}
      <div ref={hintRef} className="absolute inset-x-0 bottom-6 text-center">
        <span className="font-mono text-[0.7rem] uppercase tracking-label text-ej-smoke animate-ej-glow">
          ↓ Scroll to drop the needle
        </span>
      </div>
    </div>
  );
}
