"use client";

import { useEffect } from "react";

/**
 * ViewportScaler — Universal Resolution-Independent Scaling System
 *
 * Calculates a single `--vscale` CSS custom property on :root that
 * represents a uniform scale factor relative to a fixed design canvas.
 *
 * All typography and spacing that uses `calc(var(--vscale) * <design-px>)`
 * will render at the exact same visual proportion on every device —
 * regardless of resolution, aspect ratio, or orientation.
 *
 * Design canvases:
 *   Desktop (landscape):  1920 × 1080
 *   Mobile  (portrait):    390 ×  844
 *
 * Scale = min(viewportW / designW, viewportH / designH)
 * This ensures the design always fits without overflow on any screen.
 */

const DESKTOP_W = 1920;
const DESKTOP_H = 1080;
const MOBILE_W = 390;
const MOBILE_H = 844;
const BREAKPOINT = 768; // px — below this we use mobile canvas

function computeScale(): number {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const isMobile = vw < BREAKPOINT;
  const designW = isMobile ? MOBILE_W : DESKTOP_W;
  const designH = isMobile ? MOBILE_H : DESKTOP_H;

  // Uniform scale: fit the design canvas into the viewport
  return Math.min(vw / designW, vh / designH);
}

export default function ViewportScaler() {
  useEffect(() => {
    const update = () => {
      const scale = computeScale();
      document.documentElement.style.setProperty(
        "--vscale",
        scale.toFixed(6)
      );
    };

    update();

    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return null; // This component renders nothing — it only sets the CSS variable
}
