import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState, Theme, Language, SettingsPreferences } from "../types";

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme") as Theme;
  const theme = savedTheme || "system";
  applyTheme(theme);
  return theme;
};

const applyTheme = (theme: Theme) => {
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("light", !isDark);
};

const getInitialPreferences = (): SettingsPreferences => {
  const savedPrefs = localStorage.getItem("preferences");
  if (savedPrefs) {
    try {
      const preferences = JSON.parse(savedPrefs) as SettingsPreferences;
      applyPreferences(preferences);
      return preferences;
    } catch {
      // Ignore
    }
  }
  return {
    reducedMotion: false,
    compactMode: false,
    autoPlayMedia: true,
  };
};

const applyPreferences = (preferences: SettingsPreferences) => {
  document.documentElement.classList.toggle("compact-mode", preferences.compactMode);
  document.documentElement.classList.toggle("reduced-motion", preferences.reducedMotion);
};

const initialState: SettingsState = {
  theme: getInitialTheme(),
  language: (localStorage.getItem("language") as Language) || "en",
  preferences: getInitialPreferences(),
  loading: false,
  error: null,
  successMessage: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
      
      applyTheme(action.payload);
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
    updatePreferences: (state, action: PayloadAction<Partial<SettingsPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
      localStorage.setItem("preferences", JSON.stringify(state.preferences));
      applyPreferences(state.preferences);
    },
    clearSettingsMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
});

export const { setTheme, setLanguage, updatePreferences, clearSettingsMessages } = settingsSlice.actions;
export default settingsSlice.reducer;
