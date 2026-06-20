# Reactive hero

The reactive hero is the single object that makes the page feel *aware* of the
visitor. It is almost always the most important 50ms of the experience — get this
breathing before you build anything else.

## Anatomy

- A `next/dynamic` client-only wrapper (R3F crashes SSR — three touches `window`).
- A `<Canvas>` with a transparent or void-radial background.
- One hero object (geometry + the brand material — see `materials-and-shaders.md`).
- A pointer hook that maps cursor position to a *target*, and a per-frame lerp
  toward that target so motion has weight and inertia.
- An idle drift so the object never goes fully still (dead-still 3D reads as a
  frozen page / broken canvas).
- A `<Suspense>` poster fallback and a `prefers-reduced-motion` short-circuit.

## Client-only mount (required)

```tsx
// components/hero/ReactiveHero.tsx
"use client";
import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => <HeroPoster />, // the same poster used as the a11y fallback
});

export function ReactiveHero() {
  return <HeroCanvas />;
}
```

Never import three / R3F into a Server Component or a module that a Server
Component pulls in at the top level. The dynamic boundary is what keeps the build
prerendering.

## Pointer with inertia

The feel comes from *not* snapping to the cursor. Track a target, lerp toward it:

```tsx
function HeroObject() {
  const ref = useRef<THREE.Group>(null!);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      // -1..1 across the viewport
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = ref.current;
    const t = state.clock.elapsedTime;
    // idle drift so it's never dead-still
    const idleX = Math.sin(t * 0.3) * 0.15;
    const idleY = Math.cos(t * 0.25) * 0.1;
    // ease toward pointer target + idle (frame-rate independent)
    const k = 1 - Math.pow(0.001, delta);
    g.rotation.y += (target.current.x * 0.5 + idleX - g.rotation.y) * k;
    g.rotation.x += (target.current.y * 0.4 + idleY - g.rotation.x) * k;
  });

  return <group ref={ref}>{/* geometry + material */}</group>;
}
```

Two things make or break it:

- **Frame-rate-independent easing** (`1 - pow(c, delta)`), not a fixed `* 0.1`,
  so it feels the same at 30 and 120fps.
- **Idle drift layered under the pointer**, so when the mouse leaves it keeps a
  slow life of its own instead of locking.

On touch devices there's no pointer — fall back to idle drift plus optional
device-orientation tilt, and never gate content behind a hover.

## Poster fallback (build this first, it's not throwaway)

`<HeroPoster />` is rendered in three situations: during the dynamic/Suspense
load, when `prefers-reduced-motion: reduce`, and when WebGL fails. It must be a
genuinely finished image — the Afterdark cover tiles in `public/work/` are the
quality bar. Same void radial, same prism mark, same spectrum.

```tsx
function HeroShell() {
  const reduced = usePrefersReducedMotion(); // simple matchMedia hook
  if (reduced) return <HeroPoster />;
  return <ReactiveHero />;
}
```

Wrap the canvas in an error boundary that renders the poster on context loss so a
GPU hiccup degrades to the still image instead of a blank page.

## Don't

- Don't run a Motion spring AND `useFrame` on the same transform — pick the R3F
  loop for anything inside the canvas (animation-lane rule).
- Don't attach `pointermove` without `{ passive: true }` — you'll fight the
  scroller.
- Don't ship a hero whose only state is "perfectly still." If the GPU is the
  reason it's still, that's the fallback's job, not the live hero's.
