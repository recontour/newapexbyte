"use client";

import { useEffect } from "react";

/**
 * ViewportScaler — Universal Resolution-Independent Scaling System
 *
 * Calculates a single `--vscale` CSS custom property on :root that
 * represents a uniform scale factor relative to a fixed design canvas.
 *
 * On mobile devices, prevents height-jump shifts caused by Android / iOS
 * address bar collapse & expansion by locking scale updates to true width / orientation changes.
 */

const DESKTOP_W = 1920;
const DESKTOP_H = 1080;
const MOBILE_W = 390;
const MOBILE_H = 844;
const BREAKPOINT = 768; // px — below this we use mobile canvas

let initialMobileVh: number | null = null;
let lastWidth: number | null = null;

function computeScale(): number {
  const vw = window.innerWidth;
  let vh = window.innerHeight;

  const isMobile = vw < BREAKPOINT;

  // On mobile, lock vh on load so address bar show/hide doesn't jump layout
  if (isMobile) {
    if (!initialMobileVh || lastWidth !== vw) {
      initialMobileVh = vh;
      lastWidth = vw;
    } else {
      vh = initialMobileVh;
    }
  }

  const designW = isMobile ? MOBILE_W : DESKTOP_W;
  const designH = isMobile ? MOBILE_H : DESKTOP_H;

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

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const isMobile = currentWidth < BREAKPOINT;

      // On mobile, ignore height-only resize events (caused by address bar show/hide)
      if (isMobile && lastWidth === currentWidth) {
        return;
      }

      lastWidth = currentWidth;
      update();
    };

    const handleOrientationChange = () => {
      initialMobileVh = null; // Reset on orientation change
      lastWidth = null;
      setTimeout(update, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return null;
}
