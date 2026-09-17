import { useEffect } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { setTheme, setSystemPreference } from "@/store/slices/themeSlice";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch(setSystemPreference(e.matches ? "dark" : "light"));
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [dispatch]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full focus-visible:ring-1">
          {mode === "light" && <Sun className="h-4 w-4" />}
          {mode === "dark" && <Moon className="h-4 w-4" />}
          {mode === "system" && <Monitor className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => dispatch(setTheme("light"))}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => dispatch(setTheme("dark"))}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => dispatch(setTheme("system"))}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
