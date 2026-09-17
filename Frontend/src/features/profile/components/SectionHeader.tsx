import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("mb-8", className)}
    >
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
    </motion.div>
  );
};
