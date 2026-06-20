# Scroll choreography

This is the one showpiece scroll beat — the moment scroll stops moving the
document and starts moving the *camera* through the space. Build exactly one of
these per page. If you find yourself wanting a second pinned section, the first one
probably isn't pulling its weight.

## The lane rule (read this before you write a line)

- **GSAP + ScrollTrigger** owns this beat and only this beat. It drives the 3D and
  the pin.
- **Lenis** smooths the native scroll and feeds its position to ScrollTrigger. It
  does not animate anything itself.
- **Motion** stays out of the pinned section's scroll-linked transforms. Motion is
  for the entrances and hovers *around* the beat, not the beat itself.

Two libraries driving the same scroll value is the classic source of stutter.
Wire them once, cleanly:

```tsx
// lenis + gsap handshake (client component, once near the root)
const lenis = new Lenis({ smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

## Pin the canvas, drive the object

Keep one persistent `<Canvas>` mounted for the whole beat and mutate the scene as
scroll progresses — don't mount/unmount canvases between scenes (context churn is
expensive and flickers).

```tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",        // length of the pinned journey
        scrub: 1,              // tie progress to scroll, with a little catch-up
        pin: true,
      },
    });
    // drive a plain object that useFrame reads, NOT the mesh directly,
    // so the render loop stays the single writer of the transform
    tl.to(scrollState, { progress: 1, ease: "none" });
  }, sectionRef);
  return () => ctx.revert();
}, []);
```

In the R3F loop, read that scroll progress and translate it into camera / object
state:

```tsx
useFrame(() => {
  const p = scrollState.progress;          // 0..1 across the pin
  camera.position.z = lerp(8, 2, p);        // fly in
  object.rotation.y = p * Math.PI * 2;      // one full reveal
  mat.uniforms.uReveal.value = p;           // hand off to a shader if needed
});
```

Letting `useFrame` be the only thing that writes the mesh transform (GSAP writes a
neutral `scrollState` object) keeps you inside the lane rule even though both
libraries are "involved."

## Scene-to-scene within the pin

Break the pinned journey into beats with a timeline, and cross-fade content
(headlines, captions) as the camera moves. Use labelled segments so it reads as
chapters, not one long tween:

```tsx
tl.addLabel("approach")
  .to(scrollState, { progress: 0.33, ease: "none" })
  .addLabel("orbit")
  .to(scrollState, { progress: 0.66, ease: "none" })
  .addLabel("dissolve")
  .to(scrollState, { progress: 1, ease: "none" });
```

Hang DOM overlays off the same ScrollTrigger progress (opacity/clip-path) so type
appears *with* the right beat — see `kinetic-type.md`.

## Mobile + reduced motion

- Recompute on resize; ScrollTrigger pins are fragile across breakpoints. Call
  `ScrollTrigger.refresh()` after layout settles and on orientation change.
- Under `prefers-reduced-motion`, **don't pin at all.** Render the scenes as a
  normal stacked, scrollable sequence of static posters. The story should still be
  legible reading top to bottom with zero scroll-jacking.
- Don't trap the scroll. The user must always be able to flick past the beat;
  `scrub` + a bounded `end` keeps it from feeling like a hostage section.

## Smell tests

- If the section stutters on scrub, something else is animating the same property,
  or you're doing heavy work (raycasts, allocations) inside `useFrame`. Hoist
  allocations out of the loop.
- If the pin "jumps" on entry, your `end` distance and the content height
  disagree — refresh after fonts/images load.
