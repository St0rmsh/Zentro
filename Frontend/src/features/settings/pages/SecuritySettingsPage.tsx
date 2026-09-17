import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";

export const SecuritySettingsPage = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <SettingsHeader
        title={t("settings.security.title")}
        description={t("settings.security.description")}
      />

      <SettingsCard title={t("settings.security.changePassword.title")} description={t("settings.security.changePassword.description")}>
        <div className="max-w-md">
          <ChangePasswordForm />
        </div>
      </SettingsCard>
    </motion.div>
  );
};