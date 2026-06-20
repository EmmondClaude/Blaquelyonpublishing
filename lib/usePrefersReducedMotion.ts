"use client";

import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion: reduce`. Per performance-and-a11y.md this is one
 * of the three independent switches that must resolve the spectacle to the poster.
 * Starts `false` so SSR/first paint matches the motion default, then corrects on
 * mount (and on change) — the hero short-circuits to the static poster when true.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
