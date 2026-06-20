# Kinetic typography

Type in this aesthetic *assembles* — it masks up, splits, and reveals on scroll,
layered over (and ideally reacting to) the 3D rather than floating in a separate
plane. Done right it's half the "alive" feeling. Done wrong it's a CLS nightmare
that hides the headline from search engines and screen readers.

## The cardinal rule: the text is always really there

Animate *presentation*, never *existence*. The full heading must be in the DOM as
real, selectable, accessible text from first paint — you reveal it with transforms
and clips, you don't type it in character by character from an empty node. This
keeps it legible to SEO, screen readers, and reduced-motion users, and avoids
layout shift.

## Mask reveal (the house default)

Wrap each line in an overflow-hidden mask and slide the line up into view. Weighted
easing is the whole effect — linear looks like a debug build.

```tsx
// Motion — owns entrances, so it owns this
<span className="block overflow-hidden">
  <motion.span
    className="block"
    initial={{ y: "110%" }}
    whileInView={{ y: "0%" }}
    viewport={{ once: true, margin: "-10% 0px" }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} // expo-out
  >
    Luminous brand experiences
  </motion.span>
</span>
```

Stagger lines with a parent `staggerChildren` so a headline cascades instead of
popping all at once.

## Split-text, safely

For per-word or per-char motion, split a *copy* and hide the original from
assistive tech — don't shatter the accessible string into 30 nodes a screen reader
reads letter by letter:

```tsx
<h1 className="relative">
  <span className="sr-only">Refracted into two worlds</span>
  <span aria-hidden className="flex flex-wrap gap-[0.25em]">
    {words.map((w, i) => (
      <motion.span key={i} /* per-word reveal */ >{w}</motion.span>
    ))}
  </span>
</h1>
```

The `sr-only` real string is what gets read and indexed; the animated `aria-hidden`
copy is pure decoration.

## Tie type to the 3D, not a separate timeline

When type sits over the pinned scroll beat, drive it from the *same* ScrollTrigger
progress (see `scroll-choreography.md`) so headlines land on the right camera
moment. Hang `clip-path` or opacity off the shared progress value rather than
giving the text its own scroll listener — one source of truth, no drift.

```tsx
// clip the headline open in lock-step with the 3D reveal
style={{ clipPath: `inset(0 ${100 - progress * 100}% 0 0)` }}
```

You can also let the 3D push the type: sample the hero object's screen-space
position and offset a headline a few pixels toward/away from it for parallax that
makes the layers feel co-present instead of stacked.

## Type system

- Serif display (Fraunces / the project's display face) for the wordmark moments;
  a clean sans for support copy; mono for meta/labels. That three-voice mix is the
  Afterdark register — see the cover tiles.
- Load fonts with `next/font` and `display: "swap"`, and trigger reveals *after*
  fonts are ready (`document.fonts.ready`) so masks don't reveal a fallback that
  then reflows.

## The editorial-luxury register (what the references share)

Every site in `reference-sites.md` and nearly every reel — Eros Gold, Saratoga,
"Beyond the Idea of a Yacht," "Where Design Meets Tomorrow," David Whyte — speaks the
same type language, and it's worth naming because it's the difference between
"premium" and "tech demo." The register is **fashion-magazine, not SaaS**:

- **One oversized serif statement, acres of space around it.** The headline is large,
  set in the display serif, and *alone* — it doesn't share the screen with three
  supporting paragraphs. Negative space is the luxury signal; a crowded hero reads
  cheap no matter how good the 3D is.
- **Restraint in weight and count.** A light/regular display weight, not bold; one
  headline, one short line of support, one CTA. If you're reaching for a second
  headline on the first screen, cut it.
- **Editorial phrasing.** Short, declarative, a little literary ("A Journey Through
  Time," not "Scroll to learn more about our process"). The copy carries the same
  premium restraint as the layout.
- **Tight optical detail.** Generous letter-spacing on small caps/labels, near-zero on
  the big serif, real ligatures, hung punctuation where it matters. These micro-choices
  are most of why luxury type looks luxury.

This pairs with, doesn't replace, the kinetic reveals above: the editorial headline is
*what* you set, the mask/split reveal is *how* it arrives. Get the register wrong and
the animation just makes cheap type move.

## Reduced motion

Under `prefers-reduced-motion: reduce`, every reveal resolves instantly to its
final state — text simply *is there*, fully styled, no slide, no split, no clip
animation. Because the real text was always in the DOM, this is a no-op gate, not a
rebuild.

## Don't

- Don't animate `y`/opacity on the element that holds the accessible text *and*
  expect SEO to see it mid-animation — keep the real string un-transformed or
  `sr-only`.
- Don't run a Motion reveal and a GSAP reveal on the same node (lane rule).
- Don't reveal on `whileInView` with `once:false` for headlines — re-triggering
  hero copy on every scroll-back feels cheap.
