# Higgsfield asset manifest — Emmond J Smith site

The shot list for the image-generation phase. Every `<PosterFrame>` in the codebase
is a labeled drop-zone; this manifest maps each one to a **soul**, a shot brief, and
the file it lands in. Generate as **clean-silhouette PNGs on a dark/void ground** so
each still does triple duty: poster fallback, parallax cut-out layer, and (for the
hero) the source for a 3D lift in the next pass.

## Souls

- **Emmond** — the artist himself. Use for any frame where Emmond is the subject:
  the home hero, the about portrait, his roster card/detail.
- **emmondv2** — the supporting / stylized soul. Use for cover art and placeholder
  roster frames where a literal likeness isn't required.

## House look (apply to every render)

After-midnight Las Vegas R&B, Cartier-grade restraint:

- **Ground:** oxblood/garnet → vinyl black (`#2A0C13 → #0A0708`), a cool indigo
  counterweight (`#15122B`) allowed in the deep background.
- **Light:** ONE warm raking light (gold `#E3C16F`), single soft bloom — studio,
  not stage. Stillness with one moving element.
- **Accent:** a single rose-neon note (`#FF4D7E`) only where it earns it (a sign, a
  rim, a reflection) — never the whole frame.
- **Texture:** vinyl, studio glass, the Strip glow seen through a hotel window.
- **Framing:** acres of negative space; the subject alone, three-quarter, premium.

## Shot list

| # | Label (in code) | Soul | File | Shot brief |
|---|---|---|---|---|
| 1 | `HERO · Emmond portrait` | Emmond | `app/page.tsx` | The first impression. Three-quarter pose, single raking gold light, oxblood/black nocturne, clean-silhouette PNG on void. This is also the 3D-lift source. 4:5. |
| 2 | `FEATURED · cover` (home) | emmondv2 | `app/page.tsx` | Square single-cover composition for "Neon Confession." 1:1. |
| 3 | `ROSTER · {name}` (home teaser) | Emmond / emmondv2 | `app/page.tsx` | Three roster cards. Emmond's own = soul **Emmond**; the two TBD writers = **emmondv2** placeholders. 4:5. |
| 4 | `ABOUT · portrait` | Emmond | `app/about/page.tsx` | Quieter editorial portrait — vinyl + studio texture, softer than the hero. 4:5. |
| 5 | `FEATURED · cover art` | emmondv2 | `app/featured/page.tsx` | The full cover art for the featured page. 1:1. |
| 6 | `ROSTER · {name}` (grid) | Emmond / emmondv2 | `app/roster/page.tsx` | Roster grid cards, same rule as #3. 4:5. |
| 7 | `ROSTER · {name}` (detail) | Emmond / emmondv2 | `app/roster/[slug]/page.tsx` | Large artist portrait on each detail page, same house lighting. 4:5. |

## Also generate (not yet slotted in the static pass)

- **OG / share card** — 1200×630, Emmond + wordmark on the nocturne ground.
- **Preloader frame** — for the 3D pass: a single brand still the deterministic
  loader reveals to (counts `0→100` in Fraunces over the gold rule).
- **Chapter posters** — for the reduced-motion fallback of the pinned scroll beat:
  one still per chapter of the Lacoste-style reveal (approach → detail → transform →
  rest), stacked as a static sequence.

## Drop-in

When a render is ready, place the PNG as an `<img>` inside its `<PosterFrame>` (the
frame stays as the backdrop/poster) and remove the handoff `label`. The CSS still
remains the reduced-motion / no-WebGL fallback underneath.
