import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={cn("flex gap-0 border-b", className)}>
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-4 py-3 font-medium text-sm transition-colors",
            activeTab === tab.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          whileHover={{ color: "var(--foreground)" }}
        >
          <div className="flex items-center gap-2">
            {tab.icon}
            {tab.label}
          </div>
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};
