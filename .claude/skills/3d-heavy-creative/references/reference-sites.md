# Reference sites — the teardown gallery

The live sites Blaque Systems studies for the Afterdark register. Each entry is
**what it actually is** (confirmed stack signature where we could read it), **the
mechanic that makes it land**, and **what to steal** for our builds. Confidence is
flagged: *confirmed* = read from the page source/headers; *reconstructed* = the
page is a locked client-rendered bundle, so the mechanic is inferred from its
behaviour + how this class of award site is universally built. Treat reconstructed
notes as a strong hypothesis to verify in-browser, not gospel.

The through-line across all seven: **one hero subject, lit like a film, revealed
by motion.** None of them open with a wall of text. They open with a held image
that resolves into depth the instant you move or scroll. That resolve-on-motion is
the whole trick the reels were selling.

---

## Lacoste — Polo Atelier Experience  *(the priority reference)*
`members-play.lacoste.com/polo-factory-experience` · **reconstructed**

A gamified scroll-journey through a stylised polo factory: thread becomes fabric
becomes a finished polo, chaptered like a guided tour, with a product/configurator
payoff at the end. Shell signatures we *could* read: fullscreen web-app
(`apple-mobile-web-app-capable`, `theme-color #000`, `viewport-fit=cover`),
`noindex,nofollow` (a standalone experience, not a marketing page), share card
baked at 1200×630. Everything below the shell is a compiled bundle we could not
open, so the mechanics are reconstructed.

**The mechanic.** This is *scroll-as-camera* (our move #2) taken to its full length
— not one pinned beat but a whole chaptered journey on a single persistent WebGL
canvas. The defining choices, in order of how much they matter:

1. **One canvas, scenes swapped by scroll progress — never remounted.** A long
   pinned scroll (`scrub`) drives a master timeline; each chapter is a labelled
   segment that moves the camera and crossfades the GLTF/material state. Context
   churn would flicker, so the canvas mounts once and *everything* is a mutation of
   uniforms and camera position. This is exactly the pattern in
   `scroll-choreography.md`, just extended to ~5 chapters.
2. **Pre-loaded, gated entry.** A locked-domain experience like this always opens
   on a deterministic preloader (`0%→100%`, see Kriss below) because a half-loaded
   WebGL journey is worse than a 2-second wait. The loader doubles as the brand
   beat. Build the gate first; it is not optional polish.
3. **Material storytelling.** The "wow" is watching one material *become* another —
   thread→knit→fabric→garment. That's a displacement/normal-map crossfade between
   states on the same geometry, driven by scroll progress (our move #3, morph
   transitions). The camera barely cuts; the *surface* transforms.
4. **A diegetic product payoff.** The journey earns a configurator/hero-product
   moment at the end — the polo you can spin. The narrative is the on-ramp to a
   product shot, which is the whole commercial point.

**What to steal.** The chaptered single-canvas journey with a hard preloader gate
and material-morph storytelling. For our scope, do **one** such journey per site
(the Refraction beat), not a five-minute epic — Lacoste has a brand budget we're
compressing into a single showpiece. Keep the reduced-motion fallback as a stacked
sequence of the chapter posters (see `scroll-choreography.md` → reduced motion).

> To verify the reconstruction: open it in a browser and read the network panel for
> `three`, `gsap`, a `.glb`/`.gltf` list, and the loader's asset manifest. If we
> ever get read access to the tab, that's the first thing to pull.

---

## David Whyte — Experience  *(confirmed: WordPress + custom WebGL engine + audio)*
`davidwhyte.com/experience`

Awwwards Site of the Month, FWA, CSS Design Awards. A watercolour-dissolve poetry
portal: words and paintings bleed into each other as you move. Confirmed from
source: a WordPress theme (`wp-content/themes/davidwhyte/...`) wrapping a custom
experience engine under `/resources/assets/xp/`, with **three synced audio loops**
(`loop-main.mp3`, `loop-poem.mp3`, `loop-painting.mp3`) and hover SFX
(`over-cta-*.mp3`).

**The mechanic.** Texture displacement as the entire language — a flowmap/noise
shader pushes one watercolour texture into the next so transitions *bleed* instead
of cut. The standout lesson is **sound as a first-class layer**: cross-fading
ambient loops keyed to which "room" you're in turns a visual site into an
atmosphere. Most "3D" sites forget audio entirely; this one is half its impact.

**What to steal.** The displacement-bleed transition (it's a softer cousin of our
RGB-split/dither morphs — add a watercolour/flow variant to
`materials-and-shaders.md`). And the audio idea: an optional, muted-by-default,
user-toggled ambient layer that cross-fades by section. Gate it behind an explicit
unmute — never autoplay sound — but when the user opts in, it's the cheapest
upgrade from "website" to "experience."

---

## Montfort Group  *(confirmed: Astro v5.2.6, view-transitions)*
`mont-fort.com`

A commodity-trading corporate site that feels like a luxury brand. Confirmed:
Astro 5 with `astro-view-transitions-enabled`, content server-rendered (we read the
full body), a WebGL hero behind editorial copy, "Scroll down to discover."

**The mechanic.** This is the *restrained* end of the spectrum and the most useful
proof for client work: **Astro ships the content as real HTML (fast, indexable,
accessible) and layers a WebGL hero + scroll reveals on top.** View-transitions give
buttery page-to-page morphs for nearly free. The 3D is an accent on a fundamentally
solid document, not the whole house of cards.

**What to steal.** The architecture lesson for any client who needs SEO *and*
spectacle: real content first, canvas as enhancement. This is the bridge between
our Daylight and Afterdark postures — when a creative client also needs to rank,
reach for this shape. (Our stack does the same with RSC + a client-only canvas.)

---

## 8bit.ai  *(confirmed: Next.js, fully client-rendered)*
`8bit.ai`

A WebGL studio's own site — pure flex, the canvas *is* the page. Confirmed: Next.js
(`next-head-count`), near-empty server HTML, `theme-color #000`.

**The mechanic.** Maximalist — continuous WebGL with the content composited *into*
the 3D world rather than laid over it. This is the far end we generally **don't**
ship for clients (no static fallback worth the name, brutal on weak GPUs), but it's
the reference for ceiling-level ambition and transition craft. Study it for *how
far* the morph language can go, then pull back to something shippable.

**What to steal.** Transition vocabulary and timing, not the architecture. Treat it
as the mood board, not the blueprint.

---

## Kriss.ai  *(confirmed: Payload CMS + client WebGL, preloader gate)*
`kriss.ai`

An AI healthcare product site with a premium WebGL hero. Confirmed: Payload CMS
backend, client-rendered, opens on a `0%` numeric preloader.

**The mechanic.** The **deterministic preloader** — count real asset progress to
100%, then reveal. For any heavy-WebGL hero this is the difference between "premium"
and "broken on arrival." It sets expectation, hides decode/compile jank, and is a
brand beat in itself. Note it's a *product* site (a CMS behind it), proving the
register works for SaaS-adjacent clients, not just art projects.

**What to steal.** Always gate a heavy hero behind a real progress preloader. Add a
canonical loader recipe to `reactive-hero.md`. Pair with our poster fallback: poster
paints instantly for reduced-motion/no-WebGL; the loader runs only when we're
actually booting the canvas.

---

## open-sbs.brig.ht/city  *(confirmed: Vue SPA, fully client WebGL)*
`open-sbs.brig.ht/city`

An explorable WebGL city. Confirmed: Vue ("bright-template" noscript), fully
client-rendered.

**The mechanic.** A *navigable* 3D space — the user drives the camera through a
world rather than being flown on rails. This is the most expensive mode (free-camera
worlds need LOD, culling, streaming) and the least appropriate for most client work,
but it's the reference for "explorable place" when a brief genuinely calls for one.

**What to steal.** Mostly a cautionary reference — know what free-roam costs before
you promise it. When a brief wants "a world," counter-propose a rails journey
(Lacoste-style) that delivers 90% of the feel for 10% of the budget and ships with a
real fallback.

---

## How these map to our five moves

| Site | Primary move it demonstrates |
|---|---|
| Lacoste | Scroll-as-camera (#2), extended to a chaptered journey + material morph (#3) |
| David Whyte | Morph transitions (#3) via displacement, plus a synced audio layer |
| Montfort | Restrained architecture — content-first, 3D as accent (the Daylight↔Afterdark bridge) |
| 8bit | Morph vocabulary ceiling (#3) — mood board, not blueprint |
| Kriss | Preloader gate + reactive hero (#1) for a real product |
| open-sbs | Free-roam world — know the cost; usually counter to a rails journey |

Two gaps these surfaced that the original five moves under-served — now covered in
their own references: the **chaptered product-reveal journey** with a preloader gate
(`cinematic-product-reveal.md`), and the **editorial-luxury type register** the
reels all share (folded into `kinetic-type.md`).
