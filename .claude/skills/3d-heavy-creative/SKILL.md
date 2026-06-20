---
name: 3d-heavy-creative
description: >-
  The Blaque Systems playbook for building expressive, motion-and-3D-forward
  creative websites — the "Afterdark" posture. Use this skill WHENEVER the work
  calls for a WebGL/3D hero, scroll-driven 3D, shader transitions, glass /
  refraction / iridescent material language, kinetic typography, or a "wow on
  first scroll" cinematic feel — even if the user only says things like "make it
  3D," "more alive," "like those AI website reels," "neon," "immersive,"
  "cyberpunk," or names a creative client (musician, influencer, artist, brand).
  This is the default posture for any Afterdark build and for client work that
  should feel like an experience, not a brochure. Do NOT use it for restrained
  business/Daylight sites where clarity and conversion outrank spectacle — use
  the web-agency posture there instead.
---

# 3D-Heavy Creative (Afterdark posture)

This is how Blaque Systems builds the **expressive** half of the work: sites that
feel like a held breath on load and reward every scroll. The reference is the
"AI website" reel aesthetic — a reactive 3D object that tracks you, type that
assembles itself, sections that don't *cut* but *morph*, and a single coherent
visual world threaded through the whole thing. The job of this skill is to get that
feel reliably without the build collapsing into a janky, inaccessible, unshippable
mess.

**This posture is about creativity, not a house look.** "Afterdark" is the name for
the expressive *route*, not a fixed neon-and-light aesthetic to apply to every
client. The job is to find the world the *particular client* lives in and build
that — a fashion house, a musician, an architect, a food brand each want a different
material, palette, and tempo. When a client is particular, you pivot to them; you do
not bend them toward Blaque's own signature.

The whole philosophy in one line: **one coherent visual system, refracted many
ways.** Decide the client's single idea — their material, their spectrum, their
light — and show it from a new angle in every scene. Spectacle is in service of that
coherence, never noise. (Blaque's *own* house expression of this principle is "one
light source, refracted" — the Prism, on the Afterdark spectrum. That's our
signature for our own site, an example of the principle, not a default to inherit.)

## When you're in the right place

Reach for this skill when the user wants the site to *perform*: a creative client
(brand, musician, influencer, artist, studio), an Afterdark route, or any explicit
ask for 3D, WebGL, shaders, "immersive," "cinematic," "neon," "alive," or "like
those reels." If the brief is a doctor, lawyer, contractor, SaaS dashboard, or
anything where a confused visitor costs a sale, you're in the **wrong** posture —
restraint wins there. Spectacle that buries the call-to-action is a failure even
on Afterdark.

## The five moves

A 3D-heavy build is almost always a combination of these. Don't do all five on one
page just because you can — pick the two or three that carry the story, and let the
rest breathe.

1. **The reactive hero.** A single WebGL object that responds to the cursor
   (parallax / cursor-follow / idle drift) so the page feels aware of the visitor.
   This is the first impression and it does most of the emotional work.
2. **Scroll-as-camera.** Pin the canvas and let scroll drive the 3D — rotate the
   object, fly the camera through scenes, swap what's on screen. Scroll stops being
   "move the document" and becomes "move through the space."
3. **Morph transitions.** Sections don't hard-cut. A shader displaces, an RGB-split
   tears, a dither dissolves — the previous scene *becomes* the next one.
4. **Material language.** Glass, refraction, fresnel rim-light, iridescence,
   volumetric light. The materials *are* the brand. Get these right and even a
   plain sphere reads as premium.
5. **Kinetic typography.** Type that masks, splits, assembles, and reveals on
   scroll — layered over (and reacting to) the 3D, not floating in a separate plane.

These five moves serve two registers, and most briefs are one or the other. The
**abstract** register — a refracted light-object that breathes — is Blaque's own
house expression (the Prism), and a good option when a client has no product to
feature; it is not the default to reach for on every creative brief. The
**product-as-hero** register — one real thing (a bottle, a garment, a watch, a car)
lit like a film and revealed by motion — is what most of the reference reels and
award sites actually do; see `references/cinematic-product-reveal.md`. Same five
moves, same lane rules, same commitment to coherence — but the spectrum, material,
and mood are the **client's**, set by their brand and the meeting brief, not a fixed
house palette. What changes between registers is whether the hero is light itself or
a thing the light is on. Decide which register the brief wants before you start, and
skim `references/reference-sites.md` for the live-site bar.

For the concrete how-to on each, read the reference files below as you reach that
part of the build. Don't preload them all — pull each one when you start that move.

- `references/reactive-hero.md` — R3F hero setup, pointer tracking, idle drift, the poster fallback.
- `references/scroll-choreography.md` — pinning the canvas, GSAP ScrollTrigger driving 3D, Lenis smoothing.
- `references/cinematic-product-reveal.md` — the product-as-hero journey: chaptered scroll reveal, the preloader gate, and the video+PNG composite that fakes depth. Read when the hero is a *thing* (bottle, garment, watch, car), not an abstract light-object.
- `references/materials-and-shaders.md` — glass/refraction/fresnel/iridescence recipes and the morph-transition shaders.
- `references/kinetic-type.md` — mask reveals, split-text, scroll-linked typography over 3D, and the editorial-luxury type register the references share.
- `references/performance-and-a11y.md` — the non-negotiable fallback + perf checklist. Read this one EVERY build.
- `references/reference-sites.md` — the teardown gallery: Lacoste, David Whyte, Montfort, 8bit, Kriss, open-sbs — what each is, the mechanic, and what to steal. Skim before pitching or starting an Afterdark build for the live-site bar.

## The Apex stack you're building on

This skill assumes the repo's stack and lanes (see the project `CLAUDE.md`). The
load-bearing rules:

- **R3F / drei / three** for all WebGL. Load every 3D component client-only via
  `next/dynamic(() => import(...), { ssr: false })` — three.js touches `window`/
  `document` and will crash SSR otherwise.
- **Animation lanes never overlap on one animation.** Motion owns entrances,
  hovers, and UI transitions. GSAP + ScrollTrigger owns the rare scroll showpiece
  (the pinned 3D beat). Lenis stays light and just smooths the scroll. Two
  libraries animating the same property is the fastest way to jank — pick one per
  element and commit.
- **Design tokens, not arbitrary values.** Colors/glows live in `tailwind.config.ts`.
  The *rule* is "tokenize one coherent ramp and have the shaders sample it, so the 3D
  and the CSS read as one family" — the rule is not "use Blaque's colors." On a client
  build the ramp is the **client's** brand, namespaced to that project. Blaque's own
  Afterdark spectrum (`#22E6FF → #7FF0FF → #8B5CF6 → #FF2E97 → #C70E6E` on a void
  radial `#141121 → #07060B`, under `dark-*`) is the ramp for *our* site only — it is
  an instance of the rule, never an obligation to import into client work.
- **Server Components by default;** `"use client"` only where state/effects/3D need it.

## The order that keeps you out of trouble

The temptation is to open with the showpiece shader and spend a day on it. Don't.
Build in this order so you always have a shippable site and the spectacle lands on
a solid base:

1. **Static-first.** Lay out the page with the real copy and a poster image where
   the hero will go. This is also your `prefers-reduced-motion` fallback, so it's
   not throwaway work — it's a required deliverable you happen to build first.
2. **Hero, reactive.** Drop in the R3F object and wire pointer + idle drift. Get one
   thing breathing before you choreograph anything.
3. **Scroll beat.** Pin the canvas and choreograph the one showpiece scroll. One.
   Adding a second pinned section usually means the first one wasn't strong enough.
4. **Transitions + type.** Layer the morph between sections and the kinetic
   headlines. This is polish — it should snap onto a page that already works.
5. **Gate + verify.** Wrap every motion/3D effect behind reduced-motion and the
   poster fallback, then `npm run build` and watch it on a throttled device.

## What "good" looks like (and what kills it)

The reel aesthetic works because of restraint *inside* abundance: lots of motion,
but all of it the same material, same light, same spectrum, moving as one system.
The failure mode is five effects from five tutorials fighting each other.

- **One object, many angles** beats five unrelated 3D gimmicks. Coherence is the
  premium signal.
- **Motion with a hierarchy.** Something is always the lead; everything else is
  support. If everything moves equally, nothing reads.
- **Easing is the whole game.** Linear motion looks like a debug build. Weighted,
  decelerating motion (and a touch of inertia on the pointer) is what makes it feel
  expensive.
- **It must survive being turned off.** A reduced-motion visitor, a weak GPU, or a
  failed WebGL context should land on a poster that is genuinely beautiful on its
  own. If the static version is ugly, the build isn't done — see
  `references/performance-and-a11y.md`.

## Before you call it done

Run `npm run build` (type-check + lint + prerender). Then sanity-check the three
things that actually break this kind of site: load with `prefers-reduced-motion:
reduce` and confirm the poster fallback is whole; throttle to a mid-tier mobile GPU
and confirm it holds ~60fps or degrades gracefully; and tab through to confirm the
content and CTAs are reachable with no motion at all. Spectacle that fails any of
these isn't shippable, however good it looks on your machine.
