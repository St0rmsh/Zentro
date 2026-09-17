/**
 * Animation Constants
 * Reusable Framer Motion variants and animation presets
 */

export const ANIMATION_VARIANTS = {
  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeOut: {
    hidden: { opacity: 1 },
    visible: { opacity: 0 },
  },
  
  // Slide animations
  slideInFromLeft: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  slideInFromRight: {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  slideInFromTop: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  slideInFromBottom: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  
  // Scale animations
  scaleIn: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  scaleOut: {
    hidden: { scale: 1, opacity: 1 },
    visible: { scale: 0.9, opacity: 0 },
  },
  
  // Rotate animations
  rotateIn: {
    hidden: { rotate: -10, opacity: 0 },
    visible: { rotate: 0, opacity: 1 },
  },
  
  // Page transitions
  pageTransitionIn: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  },
  pageTransitionOut: {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  },
  
  // Modal/Dialog
  modalBackdrop: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  modalContent: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  
  // List item stagger
  listItem: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  },
  
  // Bounce
  bounce: {
    hidden: { y: 0 },
    visible: {
      y: [-5, 0, -5, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
      },
    },
  },
  
  // Pulse
  pulse: {
    hidden: { opacity: 0.6 },
    visible: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  },
};

export const ANIMATION_TRANSITIONS = {
  fast: { duration: 0.15, ease: "easeInOut" },
  base: { duration: 0.2, ease: "easeInOut" },
  slow: { duration: 0.3, ease: "easeInOut" },
  slower: { duration: 0.5, ease: "easeInOut" },
  elastic: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] },
  spring: { type: "spring", stiffness: 100, damping: 15 },
  bouncy: { type: "spring", stiffness: 200, damping: 10 },
};

export const STAGGER_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  },
};

export const HOVER_SCALE = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

export const HOVER_LIFT = {
  whileHover: { y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" },
  whileTap: { y: 0 },
  transition: { duration: 0.2 },
};
