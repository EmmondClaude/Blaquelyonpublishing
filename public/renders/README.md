# /public/renders — where the Higgsfield exports lay

Drop each generated render here using the exact filename below, then pass its path
as `src` to the matching `PosterFrame` (or composite it into the hero). The CSS still
stays behind every image as the load / reduced-motion / no-WebGL fallback, so a slot
is never broken whether or not its file exists yet.

| Filename (drop here) | Slot | Soul | Used in | Aspect |
|---|---|---|---|---|
| `hero-emmond.png` | Home hero portrait | Emmond | `components/hero/ReactiveHero.tsx` (composite over / beside the vinyl) | 4:5 |
| `featured-cover.png` | "Neon Confession" cover art | emmondv2 | `app/featured/page.tsx`, home featured block | 1:1 |
| `about-portrait.png` | About editorial portrait | Emmond | `app/about/page.tsx` | 4:5 |
| `roster-emmond.png` | Roster card — Emmond | Emmond | `app/roster/*`, home roster teaser | 4:5 |
| `roster-writer-tbd-01.png` | Roster card — writer 1 | emmondv2 | `app/roster/*` | 4:5 |
| `roster-writer-tbd-02.png` | Roster card — writer 2 | emmondv2 | `app/roster/*` | 4:5 |
| `og-card.png` | Social share card | Emmond | `app/layout.tsx` openGraph | 1200×630 |

## To light a slot

```tsx
// before — placeholder (CSS still + Higgsfield stamp)
<PosterFrame label="ABOUT · portrait" soul="Emmond" aspect="aspect-[4/5]" note="…" />

// after — render drops in, stamp disappears, still stays as the fallback behind
<PosterFrame label="ABOUT · portrait" soul="Emmond" aspect="aspect-[4/5]"
  src="/renders/about-portrait.png" alt="Emmond J Smith — portrait" />
```

House look + per-shot briefs: see `../../HIGGSFIELD-ASSETS.md`. Export clean-silhouette
PNGs on a dark/void ground so each still doubles as poster, parallax cut-out, and (for
the hero) a 3D-lift source.
