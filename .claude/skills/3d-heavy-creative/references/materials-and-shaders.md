# Materials & shaders

The materials *are* the brand. A plain sphere in the right glass-refraction-fresnel
material reads as premium; the most intricate geometry in a flat material reads as
a tutorial. Spend your time here.

Everything samples the **Afterdark spectrum** so the 3D and the CSS are one family:
`#22E6FF → #7FF0FF → #8B5CF6 → #FF2E97 → #C70E6E` over void `#141121 → #07060B`.

## The material vocabulary

Reach for these four, mostly via drei so you're not hand-writing what's already
solved:

- **Glass / refraction** — `MeshTransmissionMaterial` (drei). The signature look:
  light bends through the object and picks up the spectrum behind it. Key dials:
  `transmission: 1`, `thickness`, `ior` (~1.3–1.6), `chromaticAberration` (this is
  what splits the light into the spectrum at the edges), `roughness` low.
- **Iridescence** — a thin-film sheen that shifts hue with view angle. `MeshPhysicalMaterial`
  supports `iridescence`, `iridescenceIOR`, `iridescenceThicknessRange`. This is
  the oil-slick / soap-bubble shimmer that makes neon feel wet and alive.
- **Fresnel rim-light** — brightening at grazing angles so the silhouette glows in
  the brand color. Cheap, huge payoff. A few lines of shader (below) or layer a
  `Fresnel`-style effect.
- **Volumetric light** — god-rays / soft bloom so the object sits in atmosphere,
  not a vacuum. Use postprocessing `Bloom` (selective, thresholded) rather than
  blasting emissive everywhere.

```tsx
// drei transmission glass — the house default for hero objects
<MeshTransmissionMaterial
  transmission={1}
  thickness={1.2}
  ior={1.4}
  chromaticAberration={0.06}   // spectrum at the edges
  roughness={0.05}
  background={voidColor}
/>
```

## Fresnel rim (hand-rolled, when you want exact control)

```glsl
// fragment — add to emissive
uniform vec3 uRimA;   // cyan  #22E6FF
uniform vec3 uRimB;   // magenta #FF2E97
varying vec3 vNormal;
varying vec3 vView;

void main() {
  float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.5);
  vec3 rim = mix(uRimA, uRimB, fres);     // ride the spectrum across the rim
  gl_FragColor = vec4(rim * fres, 1.0);
}
```

Pass the spectrum endpoints as uniforms so the rim is literally the brand ramp —
not an approximation a designer has to reconcile later.

## Spectrum ramp as a uniform

Bake the five stops into a small 1D gradient texture (or a `mix` chain) and sample
it by some scene variable — fresnel term, height, scroll progress. That single
ramp, reused everywhere, is what makes a busy page feel composed:

```glsl
vec3 spectrum(float t){
  vec3 c0=vec3(0.133,0.902,1.0);  // #22E6FF
  vec3 c1=vec3(0.498,0.941,1.0);  // #7FF0FF
  vec3 c2=vec3(0.545,0.361,0.965);// #8B5CF6
  vec3 c3=vec3(1.0,0.180,0.592);  // #FF2E97
  vec3 c4=vec3(0.780,0.055,0.431);// #C70E6E
  t=clamp(t,0.0,1.0)*4.0;
  if(t<1.0) return mix(c0,c1,t);
  if(t<2.0) return mix(c1,c2,t-1.0);
  if(t<3.0) return mix(c2,c3,t-2.0);
  return mix(c3,c4,t-3.0);
}
```

## Morph transitions between sections

Sections morph, they don't cut. Three workhorses, each a fragment shader on a
full-screen quad (or a transition material) driven by a `uProgress` uniform that
you tie to scroll or a Motion value:

- **RGB-split tear** — offset the R/G/B sample by `uProgress` along a direction so
  the outgoing scene shears into chromatic fringes before resolving. On-brand
  because the fringes are the spectrum.
- **Displacement dissolve** — sample a noise texture; pixels above
  `noise > uProgress` show scene A, below show scene B. An organic, liquid wipe.
- **Dither / bayer dissolve** — threshold against an ordered Bayer matrix for a
  retro-digital pixelated cross-fade that suits the cyberpunk register.

```glsl
// displacement dissolve core
uniform float uProgress;
uniform sampler2D uNoise, uFrom, uTo;
varying vec2 vUv;
void main(){
  float n = texture2D(uNoise, vUv).r;
  float m = smoothstep(uProgress-0.05, uProgress+0.05, n);
  vec3 col = mix(texture2D(uTo,vUv).rgb, texture2D(uFrom,vUv).rgb, m);
  // tint the seam with the spectrum so the wipe itself is branded
  col += spectrum(uProgress) * (1.0-abs(m-0.5)*2.0) * 0.25;
  gl_FragColor = vec4(col,1.0);
}
```

## Performance guardrails

- `MeshTransmissionMaterial` is expensive (it re-renders the scene for the
  backbuffer). One transmission object per view, modest `samples`/`resolution`.
  Don't carpet a page with glass.
- Bloom: threshold it so only genuine highlights bloom; full-frame bloom turns
  text to mush and tanks fps.
- Keep shader work per-fragment cheap; move anything constant to uniforms computed
  on the CPU once per frame.
- Provide a low-tier path: detect a weak GPU (low `renderer.capabilities`,
  small screen, or a quick fps probe) and swap glass for a cheap matcap/standard
  material plus the rim — visually adjacent, fraction of the cost.

## Don't

- Don't invent a new palette per section. Same ramp, new angle.
- Don't stack three post-effects "to be safe" — each one is full-frame. Bloom plus
  maybe one transition pass is the budget.
- Don't ship emissive-everything; glow means nothing if it's uniform. Glow the
  lead, let the rest sit in shadow.
