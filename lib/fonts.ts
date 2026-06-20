import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

/**
 * The three-voice editorial-luxury type system (per kinetic-type.md):
 *   • Display serif  — Fraunces, the oversized statement set ALONE with acres of
 *     space. Light/regular optical sizing, low contrast — the Cartier register.
 *   • Sans support   — Inter, quiet and legible, carries body + UI.
 *   • Mono credits   — JetBrains Mono, for songwriting credits, labels, meta.
 *
 * `display: "swap"` so masks never reveal a fallback that then reflows; reveals in
 * the 3D pass should wait on `document.fonts.ready`.
 */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  // Variable font: omit `weight` (the full wght range ships) so we can request the
  // optical-size + softness axes — the luxury serif register, not a bold poster face.
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

export const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const fontVariables = `${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`;
