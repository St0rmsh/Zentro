import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface SettingsGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-4", className)}
    >
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
};
