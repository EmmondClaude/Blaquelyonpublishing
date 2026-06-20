import type { Config } from "tailwindcss";

/**
 * Emmond J Smith — design tokens (client-namespaced `ej-*`).
 *
 * ONE coherent ramp, refracted many ways. The brief's posture: this is Emmond's
 * world, not Blaque's — NO Prism / Afterdark cyan→ember spectrum here. The look
 * leans on the two priority references:
 *
 *   • CARTIER — luxury jewellery house: oxblood/garnet ground, real gold (not
 *     yellow), bone/cream ink, immense negative space, restrained serif.
 *   • LACOSTE — the chaptered material-morph scroll journey (wired in the 3D pass).
 *
 * Mood: after-midnight Las Vegas R&B — warm low light, the Strip glimpsed from a
 * hotel window, vinyl + studio texture. Premium, editorial, nocturnal.
 *
 * The rule (from the skill): tokenize ONE ramp so the CSS and the later shaders
 * read as one family. When the 3D pass lands, the hero material samples THESE hex
 * values — keep this file the single source of truth for the palette.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ej: {
          // — Grounds (the controlled darkness the object is lit against) —
          noir: "#0A0708", // vinyl black — deepest ground
          ink: "#120B0E", // page base, a hair warmer than noir
          oxblood: "#2A0C13", // Cartier garnet ground
          wine: "#3D1019", // raised oxblood — cards, panels
          indigo: "#15122B", // Vegas-night indigo — the cool counterweight

          // — Gold (the Cartier signal — restrained, metallic, never "yellow") —
          gold: "#C9A24B", // primary gold — rules, accents, wordmark
          "gold-bright": "#E3C16F", // highlight gold — specular, hover
          "gold-dim": "#8A6E33", // recessed gold — borders, hairlines

          // — Rose-neon (the SINGLE Vegas accent — used sparingly, on purpose) —
          rose: "#FF4D7E", // neon rose — the one electric note
          "rose-dim": "#B83A5E", // recessed rose

          // — Ink (bone/cream — body copy lives here for contrast on the ground) —
          bone: "#F4ECDD", // primary ink — headlines, body on dark
          cream: "#E8DBC4", // warm secondary ink
          smoke: "#A99F93", // muted ink — captions, meta
          ash: "#6E665E", // faintest ink — disabled, fine print
        },
      },
      fontFamily: {
        // Wired to next/font CSS variables in app/layout.tsx (lib/fonts.ts).
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        // Editorial-luxury optical detail: near-zero on the big serif,
        // generous on small-caps labels/credits.
        label: "0.28em",
        wordmark: "0.16em",
      },
      maxWidth: {
        editorial: "78rem", // the column the whole site breathes inside
        prose: "42rem", // long-form reading measure (blog/about body)
      },
      boxShadow: {
        // Soft, warm, low — never a hard drop shadow on this palette.
        "ej-lift": "0 24px 60px -28px rgba(0,0,0,0.85)",
        "ej-gold": "0 0 0 1px rgba(201,162,75,0.22)",
      },
      backgroundImage: {
        // The house gradient: a single warm light source raking across the ground,
        // the Strip glow from a hotel window. Reused on posters + section grounds.
        "ej-nocturne":
          "radial-gradient(120% 80% at 18% 0%, rgba(61,16,25,0.85) 0%, rgba(18,11,14,0.96) 46%, #0A0708 100%)",
        "ej-spot":
          "radial-gradient(60% 50% at 50% 38%, rgba(227,193,111,0.16) 0%, rgba(227,193,111,0) 70%)",
        "ej-gold-rule":
          "linear-gradient(90deg, rgba(201,162,75,0) 0%, rgba(201,162,75,0.7) 50%, rgba(201,162,75,0) 100%)",
      },
      keyframes: {
        // CSS-only entrance for the static pass — no JS, no CLS, reduced-motion safe.
        "ej-rise": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ej-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "ej-rise": "ej-rise 0.9s cubic-bezier(0.16,1,0.3,1) both",
        "ej-glow": "ej-glow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
