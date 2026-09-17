export type Theme = "light" | "dark" | "system";
export type Language = "en" | "es" | "fr" | "de";

export interface SettingsPreferences {
  reducedMotion: boolean;
  compactMode: boolean;
  autoPlayMedia: boolean;
}

export interface SettingsState {
  theme: Theme;
  language: Language;
  preferences: SettingsPreferences;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
