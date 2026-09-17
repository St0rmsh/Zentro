import { Moon, Sun, Monitor, LucideIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { setTheme } from "@/store/slices/themeSlice";
import { Theme } from "../types";
import { authService } from "@/features/auth/services/auth.service";

export const ThemeSwitcher = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.mode);

  const themeOptions: { value: Theme; label: string; icon: LucideIcon }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {themeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => { dispatch(setTheme(option.value)); void authService.updateSettings({ theme: option.value }); }}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
            currentTheme === option.value
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border/50 hover:border-primary/30 hover:bg-muted text-muted-foreground"
          }`}
        >
          <option.icon className={`h-8 w-8 mb-3 ${currentTheme === option.value ? "text-primary" : ""}`} />
          <span className="font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
