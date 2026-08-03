import type { Transition, Variants } from "framer-motion";

/**
 * Calm mobile stack navigation for restaurant flow.
 * Forward: current exits left, next enters from right.
 * Back: current exits right, next enters from left.
 *
 * Custom prop is direction: 1 = forward, -1 = back.
 */

/** Soft spring — slow ease-in, quick through the middle, settles with damping */
export const flowTransition: Transition = {
  type: "spring",
  stiffness: 88,
  damping: 20,
  mass: 1.05,
  restDelta: 0.001,
  restSpeed: 0.001,
};

/** Opacity rides a slightly longer ease so motion feels airy, not snappy */
export const flowOpacityTransition: Transition = {
  duration: 0.72,
  ease: [0.32, 0.72, 0, 1],
};

export const flowSlideVariants: Variants = {
  enter: (direction: number = 1) => ({
    x: direction > 0 ? "108%" : "-108%",
    opacity: 0.55,
    scale: 0.985,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: flowTransition,
      scale: flowTransition,
      opacity: flowOpacityTransition,
    },
  },
  exit: (direction: number = 1) => ({
    x: direction > 0 ? "-72%" : "72%",
    opacity: 0.35,
    scale: 0.985,
    transition: {
      x: flowTransition,
      scale: flowTransition,
      opacity: { duration: 0.55, ease: [0.4, 0, 1, 1] },
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
