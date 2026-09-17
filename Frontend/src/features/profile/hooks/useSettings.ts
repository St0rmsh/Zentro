import { useEffect, useState } from "react";

interface ThemeSettings {
  theme: "light" | "dark" | "system";
  reducedMotion: boolean;
  fontSize: "sm" | "md" | "lg";
}

const THEME_STORAGE_KEY = "theme-preference";
const SETTINGS_STORAGE_KEY = "user-settings";

export const useSettings = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [settings, setSettings] = useState<ThemeSettings>({
    theme: "system",
    reducedMotion: false,
    fontSize: "md",
  });
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as "light" | "dark" | "system" | null;
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

      if (savedTheme) {
        setTheme(savedTheme);
      }

      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      // Check system preference if theme is "system"
      if (!savedTheme || savedTheme === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", isDark);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    if (newTheme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));

    // Apply font size
    if (newSettings.fontSize) {
      document.documentElement.style.fontSize = newSettings.fontSize === "sm" ? "14px" : newSettings.fontSize === "lg" ? "18px" : "16px";
    }

    // Apply reduced motion
    if (newSettings.reducedMotion !== undefined) {
      document.documentElement.style.setProperty(
        "--motion-duration",
        newSettings.reducedMotion ? "0ms" : "300ms"
      );
    }
  };

  return {
    theme,
    settings,
    loading,
    updateTheme,
    updateSettings,
  };
};
