import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface ThemeToggleProps {
  value: "light" | "dark" | "system";
  onChange: (theme: "light" | "dark" | "system") => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  value,
  onChange,
  className,
}) => {
  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-2", className)}
    >
      {themes.map((theme) => {
        const Icon = theme.icon;
        return (
          <Button
            key={theme.id}
            variant={value === theme.id ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(theme.id)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {theme.label}
          </Button>
        );
      })}
    </motion.div>
  );
};
