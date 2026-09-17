import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface DangerZoneProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  loading?: boolean;
  className?: string;
}

export const DangerZone: React.FC<DangerZoneProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  loading = false,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border border-destructive/50 bg-destructive/10",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div>
          <h4 className="font-semibold text-destructive">{title}</h4>
          <p className="text-sm text-destructive/80 mt-1">{description}</p>
        </div>
      </div>
      <Button
        variant="destructive"
        onClick={onAction}
        disabled={loading}
        className="ml-4 shrink-0"
      >
        {actionLabel}
      </Button>
    </motion.div>
  );
};
