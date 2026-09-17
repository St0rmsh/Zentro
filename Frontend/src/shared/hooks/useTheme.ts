import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./index";
import { setTheme, toggleTheme as toggleThemeAction } from "@/store/slices/themeSlice";
import { useDarkMode } from "./useMediaQuery";

/**
 * useTheme Hook
 * Provides access to theme state and theme control functions
 */
export function useTheme() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);
  const prefersDark = useDarkMode();

  const setCurrentTheme = useCallback(
    (newTheme: "light" | "dark" | "system") => {
      dispatch(setTheme(newTheme));
    },
    [dispatch]
  );

  const toggleTheme = useCallback(() => {
    dispatch(toggleThemeAction());
  }, [dispatch]);

  const isDark = theme.mode === "dark" || (theme.mode === "system" && prefersDark);

  return {
    theme: theme.mode,
    isDark,
    setTheme: setCurrentTheme,
    toggleTheme,
    systemPreference: theme.systemPreference,
  };
}
