"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Lenis ⇄ GSAP handshake, wired once near the root (the lane rule, scroll-
 * choreography.md): Lenis smooths the native scroll and feeds its position to
 * ScrollTrigger; the GSAP ticker drives `lenis.raf`. Lenis itself animates nothing —
 * it only smooths. Disabled entirely under prefers-reduced-motion (native scroll,
 * no smoothing, no scroll-jacking). Renders nothing.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let lenis: import("lenis").default | null = null;
    let rafTick: ((time: number) => void) | null = null;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        smoothWheel: true,
        lerp: 0.1, // light smoothing — feeds ScrollTrigger, doesn't fight it
      });
      lenis.on("scroll", ScrollTrigger.update);

      rafTick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(rafTick);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      cancelled = true;
      if (lenis) lenis.destroy();
      // Best-effort ticker cleanup; gsap is already loaded if rafTick exists.
      if (rafTick) {
        import("gsap").then(({ default: gsap }) => gsap.ticker.remove(rafTick!));
      }
    };
  }, [reduced]);

  return null;
}
