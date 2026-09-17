import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/shared/hooks";
import { setTheme } from "@/store/slices/themeSlice";
import { authService } from "@/features/auth/services/auth.service";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

export const AppearanceSettingsPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    authService.getSettings().then((data) => {
      if (data?.settings.theme) dispatch(setTheme(data.settings.theme));
    }).catch(() => undefined);
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <SettingsHeader 
        title="Appearance Settings" 
        description="Customize how the application looks and feels." 
      />
      
      <SettingsCard title="Theme" description="Select your preferred theme for the application.">
        <ThemeSwitcher />
      </SettingsCard>
    </motion.div>
  );
};
