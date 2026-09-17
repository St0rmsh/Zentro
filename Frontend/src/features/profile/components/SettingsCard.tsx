import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  icon,
  children,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start gap-3 mb-4">
        {icon && <div className="text-primary mt-1">{icon}</div>}
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
};
