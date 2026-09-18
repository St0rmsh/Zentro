export type Theme =
  | "light"
  | "dark"
  | "system";

export type Language =
  | "en"
  | "es"
  | "fr"
  | "de";

export interface NotificationPreferences {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  mentions: boolean;
  bookmarks: boolean;
}

export interface SettingsPreferences {
  reducedMotion: boolean;
  compactMode: boolean;
  autoPlayMedia: boolean;
  notifications: NotificationPreferences;
}

export interface SettingsState {
  theme: Theme;
  language: Language;
  preferences: SettingsPreferences;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}