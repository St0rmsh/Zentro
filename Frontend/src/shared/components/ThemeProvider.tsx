import { useEffect } from "react";
import { useAppSelector } from "@/shared/hooks";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode } = useAppSelector(
    (state) => state.theme
  );

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      let theme: "light" | "dark";

      if (mode === "system") {
        theme = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
          ? "dark"
          : "light";
      } else {
        theme = mode;
      }

      root.classList.remove("light", "dark");
      root.classList.add(theme);

      root.style.colorScheme = theme;
    };

    applyTheme();

    if (mode !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleChange = () => {
      applyTheme();
    };

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, [mode]);

  return <>{children}</>;
}