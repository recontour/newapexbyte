import type { Transition, Variants } from "framer-motion";

/**
 * Calm mobile stack navigation for restaurant flow.
 * Forward: current exits fully left, next enters from right.
 * Back: reverse.
 *
 * Custom prop is direction: 1 = forward, -1 = back.
 * Uses a short tween (not a long spring) so UI stays clickable quickly.
 */

/** Elegant ease: slow → through → soft settle (~0.48s, not multi-second) */
export const flowEase = [0.22, 1, 0.36, 1] as const;

export const flowTransition: Transition = {
  duration: 0.48,
  ease: flowEase,
};

export const flowSlideVariants: Variants = {
  enter: (direction: number = 1) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.92,
    // Block taps on the panel until it lands
    pointerEvents: "none" as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    pointerEvents: "auto" as const,
    transition: flowTransition,
  },
  exit: (direction: number = 1) => ({
    // Full travel so nothing peeks behind the incoming panel
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0.9,
    pointerEvents: "none" as const,
    transition: {
      duration: 0.42,
      ease: flowEase,
    },
  }),
};

export const flowSlideProps = (direction: number) =>
  ({
    custom: direction,
    variants: flowSlideVariants,
    initial: "enter" as const,
    animate: "center" as const,
    exit: "exit" as const,
  }) as const;
