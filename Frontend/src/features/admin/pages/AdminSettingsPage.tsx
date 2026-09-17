import { motion } from "framer-motion";

export const AdminSettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">Configure platform-wide rules and features.</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Registration Settings</h3>
        <p className="text-muted-foreground text-sm">Settings panel is coming soon.</p>
      </div>
    </motion.div>
  );
};
