import React from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";

interface SettingsItemProps {
  label: string;
  description?: string;
  value?: string | React.ReactNode;
  action?: React.ReactNode;
  copyable?: boolean;
  className?: string;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  label,
  description,
  value,
  action,
  copyable = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof value === "string") {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
        className
      )}
    >
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{label}</h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {value && typeof value === "string" && (
          <p className="text-sm text-foreground/70 mt-2 break-all">{value}</p>
        )}
        {value && typeof value !== "string" && (
          <div className="mt-2">{value}</div>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        {copyable && typeof value === "string" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="transition-all"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
        {action}
      </div>
    </motion.div>
  );
};
