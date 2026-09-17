import { motion } from "framer-motion";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { FileText, ShieldAlert, FileCode2 } from "lucide-react";
import { Logo } from "@/shared/components/Logo";

export const AboutSettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <SettingsHeader 
        title="About Zentro" 
        description="Version information and legal documents." 
      />
      
      <SettingsCard className="text-center py-10">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold">Zentro App</h2>
        <p className="text-muted-foreground mt-2">Version 1.0.0 (Build 2026.08)</p>
        <p className="text-sm text-muted-foreground mt-4">
          © {new Date().getFullYear()} Zentro Inc. All rights reserved.
        </p>
      </SettingsCard>

      <SettingsCard title="Legal Documents">
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium">Terms of Service</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <span className="font-medium">Privacy Policy</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <FileCode2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Open Source Licenses</span>
            </div>
          </button>
        </div>
      </SettingsCard>
    </motion.div>
  );
};
