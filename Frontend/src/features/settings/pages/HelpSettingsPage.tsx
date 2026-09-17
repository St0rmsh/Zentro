import { motion } from "framer-motion";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { MessageCircleQuestion, Bug, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/shared/ui/button";

export const HelpSettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <SettingsHeader 
        title="Help & Support" 
        description="Get assistance or provide feedback." 
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SettingsCard className="hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircleQuestion className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">FAQ & Guidelines</h3>
            <p className="text-sm text-muted-foreground mt-2">Find answers to common questions about using Zentro.</p>
            <Button variant="link" className="mt-4">Read FAQ →</Button>
          </div>
        </SettingsCard>

        <SettingsCard className="hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Contact Support</h3>
            <p className="text-sm text-muted-foreground mt-2">Need direct help? Reach out to our support team.</p>
            <Button variant="link" className="mt-4">Email Us →</Button>
          </div>
        </SettingsCard>

        <SettingsCard className="hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Report a Bug</h3>
            <p className="text-sm text-muted-foreground mt-2">Something not working right? Let us know so we can fix it.</p>
            <Button variant="link" className="mt-4">Report Bug →</Button>
          </div>
        </SettingsCard>

        <SettingsCard className="hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Provide Feedback</h3>
            <p className="text-sm text-muted-foreground mt-2">Have a feature request or idea? We'd love to hear it.</p>
            <Button variant="link" className="mt-4">Send Feedback →</Button>
          </div>
        </SettingsCard>
      </div>
    </motion.div>
  );
};
