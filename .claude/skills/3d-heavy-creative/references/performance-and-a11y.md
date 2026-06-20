# Performance & accessibility

Read this one on **every** build. The other references make the site impressive;
this one is what makes it shippable. A 3D-heavy site that drops frames on a mid
phone, blanks on a reduced-motion visitor, or hides its CTA behind a scroll trap is
a failure no matter how good the hero looks on your machine.

## The non-negotiable: it must survive being turned off

Three independent things can switch the spectacle off, and the site has to be whole
in all three:

1. **`prefers-reduced-motion: reduce`** — the visitor asked for stillness.
2. **WebGL unavailable / context lost** — old GPU, blocklisted driver, too many
   contexts, a tab crash.
3. **A weak device** — it *can* render but not at a reasonable frame rate.

For all three the answer is the **poster fallback**: the same finished still image
you built first (the `public/work/` cover tiles are the quality bar). It is a
required deliverable, not a graceful-degradation afterthought. If the static
version isn't beautiful on its own, the build isn't done.

```tsx
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
```

Gate at the boundary: reduced-motion → poster; otherwise mount the canvas inside an
error boundary that renders the poster on context loss.

```tsx
<WebGLErrorBoundary fallback={<HeroPoster />}>
  {reduced ? <HeroPoster /> : <HeroCanvas />}
</WebGLErrorBoundary>
```

A WebGL error boundary is just a class component catching render errors *plus* a
`webglcontextlost` listener on the canvas that flips to the fallback.

## Frame budget

- **One transmission/glass object per view.** It re-renders the scene to a
  backbuffer — it's the single most expensive thing you'll place.
- **One pinned scroll beat per page**, one or two post passes total (bloom +
  maybe one transition). Each post pass is full-frame.
- **Nothing allocates inside `useFrame`.** No `new THREE.Vector3()` per frame, no
  raycasts you can cache. Hoist it out; reuse scratch objects.
- **Cap DPR:** `<Canvas dpr={[1, 2]}>` — don't render at 3x on a retina phone.
- **Pause when off-screen / hidden:** stop the loop on `visibilitychange` and when
  the canvas scrolls out of view (`frameloop="demand"` or an intersection gate).

## Tiered rendering

Detect capability once and pick a path, rather than shipping the heavy path to
everyone:

- Probe fps for ~1s on load, or read screen size / `renderer.capabilities`.
- **High:** transmission glass + bloom + transition shaders.
- **Low:** cheap matcap/standard material + fresnel rim, no transmission, no
  post — visually adjacent, a fraction of the cost.
- **Off:** poster.

Store the tier and don't thrash between tiers mid-session.

## Accessibility beyond motion

- **Keyboard:** every CTA, link, and form control reachable and operable with the
  3D entirely absent. The canvas is decorative — give it `aria-hidden` and never
  put real interactive targets only inside WebGL.
- **Focus visible** against the void background — the dark theme eats default focus
  rings; supply a bright, on-brand focus style.
- **Contrast:** neon-on-void is gorgeous and frequently *fails* WCAG for body text.
  Spectrum colors are for accents and large display type; body copy needs a near-
  white at adequate contrast. Check it.
- **No scroll trap:** the pinned beat must always be flick-past-able; bounded `end`
  + `scrub`, never a hijack that won't let the user leave.
- **Reduced-data / save-data:** consider skipping heavy textures when
  `navigator.connection.saveData` is set.

## Ship checklist

Run `npm run build` (type-check + lint + prerender), then verify by hand:

- [ ] Load with `prefers-reduced-motion: reduce` → poster fallback is whole and
      beautiful; no animation runs.
- [ ] Force WebGL off (or kill the context in devtools) → error boundary shows the
      poster, page still works.
- [ ] Throttle to a mid-tier mobile GPU + 4x CPU → holds ~60fps or degrades to the
      low tier; no long-task jank on the pinned scroll.
- [ ] Tab through the whole page → all content and CTAs reachable, focus visible,
      nothing trapped.
- [ ] Body-text contrast checked against the void background.
- [ ] No `new`/allocations inside any `useFrame`; DPR capped; loop pauses off-screen.

Spectacle that fails any of these isn't done.
