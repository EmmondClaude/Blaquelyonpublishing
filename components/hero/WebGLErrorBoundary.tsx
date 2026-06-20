"use client";

import { Component, type ReactNode } from "react";

/**
 * Catches any error thrown while rendering the WebGL subtree (failed context,
 * shader compile, driver blocklist) and shows the poster instead of a blank page.
 * Pairs with the `webglcontextlost` listener in ReactiveHero — that handles the
 * runtime event; this handles render-time throws. Both land on the same poster.
 */
export class WebGLErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Non-fatal: the fallback poster carries the experience.
    console.warn("[hero] WebGL render failed, showing poster fallback.", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
