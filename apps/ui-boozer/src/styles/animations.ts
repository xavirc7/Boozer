/**
 * Framer Motion Animation Variants for Boozer Kiosk
 * Reusable motion presets for consistent, polished animations
 */

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const slideUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1], // cubic-bezier
    },
  },
}

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
}

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

export const numberRevealVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
}

export const buttonTapVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
}

export const cardHoverVariants = {
  initial: { y: 0 },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: [0, 0, 0.58, 1] },
  },
  tap: {
    y: -4,
    transition: { duration: 0.1 },
  },
}

export const countdownVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
}

export const pulseVariants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const glowVariants = {
  initial: {
    boxShadow: '0 0 20px rgba(0, 255, 200, 0.3)',
  },
  animate: {
    boxShadow: [
      '0 0 20px rgba(0, 255, 200, 0.3)',
      '0 0 40px rgba(0, 255, 200, 0.5)',
      '0 0 20px rgba(0, 255, 200, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}
