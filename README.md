# Emmond J Smith — Las Vegas R&B Publishing

An interactive web experience for a Las Vegas–rooted music publishing house with
**Emmond J Smith** at the forefront. Built on the `3d-heavy-creative` (Afterdark)
skill, tuned to **Emmond's** world — not Blaque's house look — leaning on the two
priority references: **Cartier** (luxury jewellery-house restraint — oxblood/garnet
ground, real gold, bone ink, acres of space) and **Lacoste** (the chaptered
material-morph scroll journey, wired in the 3D pass).

> Status: **static-first pass complete.** All six routes ship with real placeholder
> copy, the `ej-*` design system, labeled poster drop-zones, and a working
> zod-validated publishing form. The reactive R3F hero and the single pinned scroll
> beat are deferred to the next pass (per the brief's stop-point).

## Stack

- **Next.js 14 (App Router) + TypeScript** — Server Components by default; the only
  `"use client"` island is the publishing form.
- **Tailwind** with client-namespaced `ej-*` tokens in `tailwind.config.ts` (one
  coherent ramp; the future shaders sample these exact hex values).
- **zod** schema in `lib/validation.ts`, shared by the React Hook Form client
  resolver **and** the `/api/publishing` route handler (the client is never trusted).
- **next/font** — Fraunces (display serif) / Inter (sans) / JetBrains Mono (credits).

## Routes

| Route | Purpose |
|---|---|
| `/` | Cinematic home — Emmond at the forefront, one editorial statement, CTA to publishing |
| `/about` | Story + accolades wall (ISC 2025 finalist, behind-the-scenes credits) |
| `/publishing` | Get-in-contact inquiry form (zod-validated, honeypot spam guard, no client secrets) |
| `/blog` + `/blog/[slug]` | The interactive journal — industry updates + company movements, tags, reading time |
| `/roster` + `/roster/[slug]` | Roster card grid → artist detail (bio, selected works, links) |
| `/featured` | Featured song — cover, player slot, lyric tease, full credits, streaming links |

## Commands

```bash
npm run dev        # local dev
npm run build      # type-check + lint + prerender (ship gate)
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## The `ej-*` design system

The single source of truth for the palette is `tailwind.config.ts`. The ramp:

- **Grounds:** `ej-noir` `#0A0708` · `ej-ink` `#120B0E` · `ej-oxblood` `#2A0C13` ·
  `ej-wine` `#3D1019` · `ej-indigo` `#15122B`
- **Gold (Cartier signal):** `ej-gold` `#C9A24B` · `ej-gold-bright` `#E3C16F` ·
  `ej-gold-dim` `#8A6E33`
- **Rose-neon (the one accent):** `ej-rose` `#FF4D7E` · `ej-rose-dim` `#B83A5E`
- **Ink (bone/cream):** `ej-bone` `#F4ECDD` · `ej-cream` `#E8DBC4` ·
  `ej-smoke` `#A99F93` · `ej-ash` `#6E665E`

Body copy uses bone/cream for WCAG contrast on the dark ground; gold and rose are
accents and large-display only.

## Accessibility (static pass)

- `prefers-reduced-motion` resolves all CSS entrances instantly (globals.css).
- Bright on-brand focus ring tuned for the dark ground; skip-link to `#main`.
- The publishing CTA and email fallback are reachable with zero motion / zero JS.
- Poster frames double as the reduced-motion / no-WebGL still (see below).

## Higgsfield image handoff

Every place a generated image will live is a `<PosterFrame>` — a finished CSS still
(beautiful on its own, doubling as the poster fallback) stamped with the exact
Higgsfield **soul** and shot brief. The full shot list is in
[`HIGGSFIELD-ASSETS.md`](./HIGGSFIELD-ASSETS.md). Souls: **Emmond** (the artist
himself — hero/about/his roster card) and **emmondv2** (covers, supporting frames).

## Next pass (deferred, per the brief)

1. Reactive R3F hero on `/` behind the existing `HERO` poster (client-only via
   `next/dynamic`, pointer + idle drift).
2. One pinned scroll beat — the Lacoste-style chaptered reveal of Emmond / "Neon
   Confession" on a single persistent canvas, with a deterministic preloader gate.
3. Kinetic mask/split type reveals layered on the headings (real text already in DOM).
4. Gate everything behind reduced-motion + the poster fallback; re-run the ship
   checklist in `.claude/skills/3d-heavy-creative/references/performance-and-a11y.md`.
