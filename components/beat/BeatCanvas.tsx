"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  Lighting,
  ScrollVinyl,
  type ScrollProgress,
} from "@/components/hero/vinyl";

/**
 * The persistent canvas for the pinned scroll beat. One mount for the whole journey
 * — scroll mutates camera/record via the shared `progressRef` (written by GSAP),
 * never a remount. Loaded client-only via next/dynamic. Pauses off-screen.
 */
export default function BeatCanvas({
  progressRef,
  onContextLost,
}: {
  progressRef: React.MutableRefObject<ScrollProgress>;
  onContextLost?: () => void;
}) {
  const roseRef = useRef<THREE.PointLight>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.02 },
    );
    io.observe(el);
    const onVis = () => setActive(!document.hidden && !!el.offsetParent);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        aria-hidden
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.4, 9.2], fov: 34 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              onContextLost?.();
            },
            { passive: false },
          );
        }}
      >
        <Lighting roseRef={roseRef} />
        <ScrollVinyl progressRef={progressRef} roseRef={roseRef} />
      </Canvas>
    </div>
  );
}
