import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "system";

export interface ThemeState {
  mode: Theme;
  systemPreference: "light" | "dark";
}

const initialState: ThemeState = {
  mode: (localStorage.getItem("theme") as Theme) || "system",
  systemPreference: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
};

const applyTheme = (theme: Theme, systemPreference: "light" | "dark") => {
  const isDark = theme === "dark" || (theme === "system" && systemPreference === "dark");
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("light", !isDark);
};

applyTheme(initialState.mode, initialState.systemPreference);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
      localStorage.setItem("theme", action.payload);

      applyTheme(action.payload, state.systemPreference);
    },

    setSystemPreference: (state, action: PayloadAction<"light" | "dark">) => {
      state.systemPreference = action.payload;

      // If in system mode, apply the new preference
      if (state.mode === "system") {
        applyTheme(state.mode, action.payload);
      }
    },

    toggleTheme: (state) => {
      if (state.mode === "system") {
        const newMode = state.systemPreference === "dark" ? "light" : "dark";
        state.mode = newMode;
        localStorage.setItem("theme", newMode);
        applyTheme(newMode, state.systemPreference);
      } else {
        const newMode = state.mode === "dark" ? "light" : "dark";
        state.mode = newMode;
        localStorage.setItem("theme", newMode);
        applyTheme(newMode, state.systemPreference);
      }
    },
  },
});

export const { setTheme, setSystemPreference, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
