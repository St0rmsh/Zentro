import { beforeEach, describe, expect, it } from "vitest";
import themeReducer, { setTheme, setSystemPreference } from "@/store/slices/themeSlice";
import pwaReducer, { setOnline, setCanInstall } from "@/pwa/pwaSlice";

describe("themeSlice", () => {
  beforeEach(() => {
    document.documentElement.className = "";
  });

  it("applies light and dark classes for explicit themes", () => {
    const initial = themeReducer(undefined, { type: "unknown" });
    themeReducer(initial, setTheme("light"));
    expect(document.documentElement).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");

    themeReducer(initial, setTheme("dark"));
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("light");
  });

  it("follows the system preference in system mode", () => {
    let state = themeReducer(undefined, setTheme("system"));
    state = themeReducer(state, setSystemPreference("light"));
    expect(document.documentElement).toHaveClass("light");
    state = themeReducer(state, setSystemPreference("dark"));
    expect(document.documentElement).toHaveClass("dark");
    expect(state.systemPreference).toBe("dark");
  });
});

describe("pwaSlice", () => {
  it("tracks connection and install state", () => {
    let state = pwaReducer(undefined, setOnline(false));
    state = pwaReducer(state, setCanInstall(true));
    expect(state.isOnline).toBe(false);
    expect(state.canInstall).toBe(true);
  });
});
