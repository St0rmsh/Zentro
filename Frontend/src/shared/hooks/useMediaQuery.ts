import { useEffect, useState } from "react";

/**
 * useMediaQuery Hook
 * Check if a media query matches and listen for changes
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Define listener
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Common media queries
 */
export const MEDIA_QUERIES = {
  isMobile: "(max-width: 640px)",
  isTablet: "(max-width: 1024px)",
  isDesktop: "(min-width: 1025px)",
  isDarkMode: "(prefers-color-scheme: dark)",
  isLightMode: "(prefers-color-scheme: light)",
  prefersReducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

/**
 * useIsMobile Hook
 * Detect if viewport is mobile
 */
export function useIsMobile(): boolean {
  return useMediaQuery(MEDIA_QUERIES.isMobile);
}

/**
 * useIsTablet Hook
 * Detect if viewport is tablet
 */
export function useIsTablet(): boolean {
  return useMediaQuery(MEDIA_QUERIES.isTablet);
}

/**
 * useIsDesktop Hook
 * Detect if viewport is desktop
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(MEDIA_QUERIES.isDesktop);
}

/**
 * useDarkMode Hook
 * Detect if dark mode is preferred
 */
export function useDarkMode(): boolean {
  return useMediaQuery(MEDIA_QUERIES.isDarkMode);
}

/**
 * useLightMode Hook
 * Detect if light mode is preferred
 */
export function useLightMode(): boolean {
  return useMediaQuery(MEDIA_QUERIES.isLightMode);
}

/**
 * usePrefersReducedMotion Hook
 * Detect if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(MEDIA_QUERIES.prefersReducedMotion);
}
