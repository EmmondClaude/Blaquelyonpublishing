# Kickoff brief — Emmond J Smith / Las Vegas R&B publishing site

A Claude Code scaffold spec. Drop the `3d-heavy-creative` skill into the repo
(`.claude/skills/3d-heavy-creative/`), open Claude Code at the repo root, and use
the **first prompt** at the bottom. This brief is the source of truth Claude Code
should read first.

---

## The one-liner (the client's intent, verbatim)

> An interactive web experience for a Las Vegas–rooted **music publishing brand**,
> with **Emmond J Smith** (R&B singer) at the forefront. It needs a way to get in
> contact for **publishing** from Emmond, surfaces his **accolades** (ISC Songwriter
> finalist 2025; hits written for stars behind the scenes), an **interactive blog**
> for industry updates + company movements, a **roster**, and a **featured song** page.

## The non-negotiable posture (read this before any design call)

This is **Emmond's** world, not Blaque's. Build the site to *his* brand — Las Vegas
R&B, his palette, his material, his mood. **Do not** inherit the Blaque "Prism" /
Afterdark cyan→ember spectrum or any house lightscape. The `3d-heavy-creative` skill's
rules (coherence, one tokenized ramp, animation lane discipline, accessibility) all
apply; the *specific* look is the client's. Creative freedom per the client and the
brief comes first — a house brand-lock is exactly what we're avoiding.

## Creative direction (a strong starting hypothesis — hold it loosely, confirm with Emmond)

- **Mood:** after-midnight Las Vegas R&B. Intimate and luxe, not cold or cyberpunk —
  warm low light, the glow of the Strip seen from a hotel window, vinyl and studio
  texture. Premium, editorial, a little nocturnal.
- **Register (per the skill): product-as-hero, cinematic reveal.** The hero is a real
  subject — Emmond himself, a spinning vinyl, a vintage mic under a single light —
  revealed by motion, not an abstract light-object. See
  `references/cinematic-product-reveal.md`.
- **Type:** editorial-luxury — one oversized serif statement with acres of space, a
  clean sans for support, mono for credits/labels. See `references/kinetic-type.md`.
- **Palette (client ramp, namespace it to Emmond, e.g. `ej-*`):** propose a warm
  nocturne — deep indigo/oxblood ground, amber/gold and a single rose-neon accent,
  vinyl black, bone-white ink. Tokenize ONE coherent ramp; shaders sample it. Final
  palette is Emmond's call.
- **Motion:** one showpiece pinned scroll beat only. Reactive hero. Optional preloader
  gate if the hero asset is heavy (`useProgress`, branded to Emmond, not a spinner).

## Routes / pages

| Route | Purpose | Notes |
|---|---|---|
| `/` | Cinematic home — Emmond at the forefront, tagline, the one scroll beat, primary CTA to publishing contact | Static-first layout + poster fallback is a required deliverable, not throwaway |
| `/about` | Story + **accolades**: ISC Songwriter **Finalist 2025**, "hits for stars behind the scenes," credits wall | Lead with the editorial bio; accolades as a quiet, confident strip |
| `/publishing` | **Get in contact for publishing** — inquiry form (name, email, project/role, links, message) | zod schema shared client+server; server-side handler; no secrets client-side; honeypot/spam guard |
| `/blog` + `/blog/[slug]` | **Interactive blog platform** — industry updates + company movements | CMS-backed (Sanity, matches the stack) or MDX; list + detail; tags; reading time |
| `/roster` + `/roster/[slug]` | **Roster** of artists/writers | Card grid → artist detail (bio, links, selected works) |
| `/featured` (or `/songs/[slug]`) | **Featured song** page | Embedded player, credits/songwriting credits, streaming links, lyric tease |

## Stack (Apex)

- **Next.js (App Router) + TypeScript**, Server Components by default; `"use client"`
  only for state/effects/animation/3D.
- **Tailwind** with client-namespaced design tokens (`ej-*`) — no arbitrary values,
  no Blaque `dark-*`/`day-*`.
- **WebGL:** R3F / drei / three, loaded client-only via
  `next/dynamic(() => import(...), { ssr: false })`.
- **Animation lanes (never overlap on one element):** Motion = entrances/hovers/UI;
  GSAP + ScrollTrigger = the single pinned beat; Lenis = light scroll smoothing.
- **Content:** Sanity (blog + roster + songs) or MDX if they want zero backend to start.
- **Forms:** `lib/validation.ts` zod schemas feeding the RHF client resolver AND the
  route handler — never trust the client. Any API key stays server-side, never
  `NEXT_PUBLIC_`.
- **Accessibility (every build):** `prefers-reduced-motion` resolves all motion to a
  whole static poster; WebGL has a poster fallback + failed-context guard; everything
  keyboard-reachable; the contact CTA is reachable with zero motion. See
  `references/performance-and-a11y.md`.

## Build order (keeps a shippable site at every step)

1. **Static-first** — all six routes with real copy and poster images where the hero
   will go. This doubles as the reduced-motion fallback.
2. **Reactive hero** — drop in the R3F subject, wire pointer + idle drift. One thing
   breathing before choreographing anything.
3. **One scroll beat** — pin the canvas, choreograph the single showpiece (the home
   reveal of Emmond / the featured song). Exactly one.
4. **Transitions + kinetic type** — morph between sections + editorial headline reveals.
5. **Gate + verify** — wrap every effect behind reduced-motion + poster fallback, then
   `npm run build` and watch on a throttled mid-tier mobile GPU.

## Content to fill in (placeholders Claude Code should stub, Emmond supplies real)

- Hero portrait / vinyl / mic asset (clean-silhouette PNG on a dark ground doubles as
  poster + cut-out + 3D source).
- The **featured song**: title, audio/stream embeds, full credits, lyric excerpt.
- **Roster**: artist names, photos, bios, links.
- **Accolades** detail: the ISC 2025 finalist proof/link; named (or NDA-safe unnamed)
  "behind the scenes" credits.
- Brand basics: logo/wordmark, exact palette, social + streaming handles, contact
  inbox for publishing inquiries.

---

## First prompt to paste into Claude Code

> Read `.claude/skills/3d-heavy-creative/SKILL.md` and `EMMOND-JSMITH-SITE-BRIEF.md`,
> then scaffold a fresh Next.js (App Router, TypeScript, Tailwind) project for the
> Emmond J Smith Las Vegas R&B publishing site described in the brief. Build
> static-first: create all six routes (`/`, `/about`, `/publishing`, `/blog` +
> `/blog/[slug]`, `/roster` + `/roster/[slug]`, `/featured`) with real placeholder
> copy and poster images, client-namespaced `ej-*` design tokens for a warm Las Vegas
> nocturne palette, and a zod-validated publishing contact form (shared client+server).
> Use the product-as-hero register and editorial-luxury type from the skill's
> references. Do NOT use Blaque's Prism spectrum — this is Emmond's own world. Wire the
> reactive WebGL hero and the single pinned scroll beat after the static pass, each
> behind a reduced-motion poster fallback. Stop after the static-first pass and show me
> the routes before adding 3D.
