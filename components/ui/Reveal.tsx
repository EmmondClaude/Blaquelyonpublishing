"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// useLayoutEffect on the client, no-op on the server (avoids the SSR warning).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Mask reveal (kinetic-type.md, the house default). A line slides up out of an
 * overflow-hidden mask with weighted expo-out easing.
 *
 * The cardinal rule: animate PRESENTATION, never EXISTENCE. The text is real,
 * selectable, indexable, and fully visible on first paint (SSR) and with no JS.
 * Only after mount — and only when motion is allowed — do we set the pre-reveal
 * state (in a layout effect, before paint, so there's no flash) and transition it
 * in when it scrolls into view. Reduced-motion visitors keep the static text.
 */
export function Reveal({
  children,
  as: Tag = "span",
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  as?: "span" | "div";
  delayMs?: number;
  className?: string;
}) {
  const inner = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsoLayoutEffect(() => {
    const el = inner.current;
    if (!el || reduced) return;

    // Pre-reveal state, set before paint.
    el.style.transform = "translateY(110%)";
    el.style.opacity = "0";

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.transition = `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delayMs}ms, opacity 0.9s ease ${delayMs}ms`;
        el.style.transform = "translateY(0)";
        el.style.opacity = "1";
        io.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, delayMs]);

  return (
    <Tag className={`block overflow-hidden ${className}`}>
      <span ref={inner} className="block will-change-transform">
        {children}
      </span>
    </Tag>
  );
}
