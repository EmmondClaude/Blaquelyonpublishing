# Cinematic product reveal — the hero-object journey

The original five moves lean **abstract** — a refracted light-object that breathes.
But the reels and the reference sites (Lacoste, Kriss, the perfume/bottle/watch/
yacht/Ferrari sites) are overwhelmingly **product-as-hero**: one real object —
a bottle, a polo, a watch, a car, a yacht — lit like a film and revealed by motion.
This file is how to build that register without it collapsing into a janky 3D demo.

Read this alongside `scroll-choreography.md` (the pin + scrub mechanics it builds
on) and `materials-and-shaders.md` (the surface that sells the object).

## The principle: the object is the brand

In this register the hero is not decoration around the message — the hero **is** the
message. A single object, alone in controlled darkness or a clean gradient, owns the
first screen. Everything else (type, captions, UI) is support that gets out of its
way. If you find yourself adding a second hero object to the first screen, you've
diluted the one thing that was working.

Three things make a product read as premium rather than "a model someone imported":

1. **Lighting, not geometry.** A simple shape with a travelling specular highlight,
   a fresnel rim, and one soft thresholded bloom beats an intricate mesh lit flat.
   Spend your time on the studio lighting rig and the material (`materials-and-shaders.md`),
   not polycount.
2. **Stillness with one moving thing.** The object is mostly still; *one* element
   moves — a slow rotation, a hotspot sliding across the surface, a single light
   arcing. Motion hierarchy (skill move) applies to a single object too.
3. **Weighted easing.** The reveal decelerates into rest. Linear reveals look like a
   turntable export. The object should arrive like it has mass.

## The chaptered reveal (scroll-as-camera, productised)

The Lacoste pattern: one persistent canvas, scroll drives a master timeline, each
chapter moves the camera and shifts the object/material state. Don't remount the
canvas between chapters — mutate uniforms and camera. The skeleton lives in
`scroll-choreography.md`; the product-specific layer is *what each chapter says about
the object*:

- **Approach.** Camera flies in from far; object silhouetted, material dim. Establish
  scale and mystery.
- **Orbit / detail.** Camera arcs to reveal a signature detail (the logo, the crown,
  the stitch). Material lights up; a hotspot crosses the surface.
- **Transform (optional, the Lacoste move).** The material *becomes* something — raw
  to finished, closed to open, off to on — via a displacement/normal crossfade on the
  same geometry. This is the chapter people screenshot.
- **Rest / call to action.** Object settles to a hero three-quarter pose; type and CTA
  resolve in. The whole journey was an on-ramp to this frame.

Hang the headline/caption opacity and clip-path off the *same* ScrollTrigger progress
so type lands on the beat (`kinetic-type.md`), and keep `useFrame` the sole writer of
the object transform.

## The preloader gate (non-negotiable for a heavy hero)

Kriss and Lacoste both open on a deterministic loader because a half-decoded WebGL
hero is worse than a two-second wait. Count *real* progress, then reveal:

```tsx
// drei gives you load progress for free
import { useProgress } from "@react-three/drei";

function Gate({ onDone }: { onDone: () => void }) {
  const { progress, active } = useProgress(); // 0..100, active=false when idle
  useEffect(() => { if (!active && progress === 100) onDone(); }, [active, progress]);
  return <Loader value={progress} />; // brand-beat counter, not a spinner
}
```

The gate runs **only when we're actually booting the canvas**. Reduced-motion / no-
WebGL visitors never see it — they get the poster instantly (see
`performance-and-a11y.md`). The loader is a brand moment: count up in the *client's* display
type, on the *client's* ground, maybe with their accent filling a thin rule. It is
the first impression, so design it to the client's brand — don't default it to a
house look.

## Faking depth: the video-plane + cut-out composite

This is the trick the reels are *actually* using when something "becomes 3D after a
beat of motion" without a real engine: it's not WebGL geometry at all — it's **2D
layers parallaxed in Z**. An AI-generated video (or a pre-rendered turntable) plays
on a back plane; cut-out PNGs of the subject (with alpha) sit on planes in front;
each layer translates by a different amount as the pointer or scroll moves. The eye
reads the differential motion as depth. It's the same principle as our VideoPlate
chorus, pushed to carry the illusion.

**When to fake vs. when to go real:**

- **Fake it (composite)** when the "3D" is a *mood* — an atmospheric hero that needs
  to feel deep but never needs to be inspected from a new angle the user chooses. It's
  far cheaper, has no GPU/WebGL failure mode, and degrades to the back-plane poster for
  free. This is the right call for most marketing heroes.
- **Go real (R3F)** when the user must control the view — a configurator, a spin, a
  product they rotate, a camera *they* drive. Anything interactive past parallax needs
  true geometry.

A composite hero, concretely — planes at different depths, pointer drives differential
translate:

```tsx
// each layer: a transparent PNG (or the video on the back plane)
// translate amount scales with the layer's intended depth
function ParallaxLayer({ src, depth }: { src: string; depth: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: PointerEvent) => {
      // -1..1 from center
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      tx = nx * depth; ty = ny * depth;            // deeper layer = larger shift
    };
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;   // inertia, frame-rate-ish
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", onMove); raf = requestAnimationFrame(tick);
    return () => { removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, [depth]);
  return <img ref={ref} src={src} alt="" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />;
}
```

Stack them back-to-front: back-plane video (`mix-blend-screen`, low opacity, `depth`
small) → mid cut-outs (`depth` larger) → foreground glints (`depth` largest). Gate the
whole thing behind `prefers-reduced-motion` and pause the video off-screen — same
rules as any motion layer. Use the brand-correct easing (`1 - pow(c, dt)` style
inertia), never linear, or the illusion reads as a slideshow.

This composite path is also our asset pipeline's reason for generating an isolated
subject (a clean-silhouette PNG on a void) alongside the ambient video: the still lifts
into a cut-out layer *and* doubles as the poster. One generation, three jobs — poster,
cut-out plane, and (if it's clean enough) the source for a real GLTF lift.

## Reduced motion / fallback

Everything here degrades to the **rest frame**: the final hero pose of the object (or
the back-plane still of the composite), full copy and CTA visible, zero scroll-jacking,
no parallax. If that single static frame isn't a beautiful poster on its own, the
build isn't done — same bar as the rest of the skill.
