/**
 * Theme Constants
 * Design tokens and theme configuration
 */

/**
 * Color Palette
 */
export const COLORS = {
  // Neutrals
  white: "#ffffff",
  black: "#000000",
  
  // Primary
  primary: "hsl(240, 46.97%, 45.1%)", // #0B63F6 equivalent
  primary50: "hsl(240, 100%, 97.1%)",
  primary100: "hsl(240, 100%, 94.3%)",
  primary200: "hsl(240, 100%, 88.6%)",
  primary300: "hsl(240, 100%, 82.9%)",
  primary400: "hsl(240, 100%, 71.4%)",
  primary500: "hsl(240, 100%, 62%)",
  primary600: "hsl(240, 100%, 55%)",
  primary700: "hsl(240, 46.97%, 45.1%)",
  primary800: "hsl(240, 50%, 35%)",
  primary900: "hsl(240, 50%, 25%)",
  
  // Grayscale
  gray50: "hsl(210, 40%, 98%)",
  gray100: "hsl(210, 40%, 96%)",
  gray200: "hsl(214, 32%, 91%)",
  gray300: "hsl(213, 27%, 84%)",
  gray400: "hsl(215, 20%, 65%)",
  gray500: "hsl(215, 16%, 47%)",
  gray600: "hsl(215, 19%, 35%)",
  gray700: "hsl(215, 25%, 27%)",
  gray800: "hsl(217, 32%, 17%)",
  gray900: "hsl(222, 47%, 11%)",
  
  // Semantic
  success: "hsl(142, 71%, 45%)",
  warning: "hsl(38, 92%, 50%)",
  error: "hsl(0, 84%, 60%)",
  info: "hsl(208, 100%, 50%)",
} as const;

/**
 * Typography Scale
 */
export const FONT_SIZES = {
  xs: "0.75rem",    // 12px
  sm: "0.875rem",   // 14px
  base: "1rem",     // 16px
  lg: "1.125rem",   // 18px
  xl: "1.25rem",    // 20px
  "2xl": "1.5rem",  // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem",    // 48px
} as const;

export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const LINE_HEIGHTS = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

/**
 * Spacing Scale
 */
export const SPACING = {
  0: "0",
  1: "0.25rem",   // 4px
  2: "0.5rem",    // 8px
  3: "0.75rem",   // 12px
  4: "1rem",      // 16px
  6: "1.5rem",    // 24px
  8: "2rem",      // 32px
  10: "2.5rem",   // 40px
  12: "3rem",     // 48px
  16: "4rem",     // 64px
  20: "5rem",     // 80px
  24: "6rem",     // 96px
} as const;

/**
 * Border Radius
 */
export const BORDER_RADIUS = {
  none: "0",
  sm: "0.125rem",  // 2px
  base: "0.375rem", // 6px
  md: "0.5rem",    // 8px
  lg: "0.75rem",   // 12px
  xl: "1rem",      // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",
} as const;

/**
 * Shadows
 */
export const SHADOWS = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

/**
 * Breakpoints
 */
export const BREAKPOINTS = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/**
 * Z-Index Scale
 */
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
} as const;

/**
 * Container Width
 */
export const CONTAINER_WIDTH = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  full: "100%",
} as const;

/**
 * Transition Durations
 */
export const TRANSITION_DURATION = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  slower: "500ms",
} as const;

/**
 * Transition Timing Functions
 */
export const EASING = {
  linear: "linear",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeInQuad: "cubic-bezier(0.11, 0, 0.5, 0)",
  easeOutQuad: "cubic-bezier(0.5, 1, 0.89, 1)",
} as const;
