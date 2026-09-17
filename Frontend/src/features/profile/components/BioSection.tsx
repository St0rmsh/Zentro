import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface BioSectionProps {
  bio?: string;
  className?: string;
}

export const BioSection: React.FC<BioSectionProps> = ({ bio, className }) => {
  if (!bio) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn("py-4", className)}
    >
      <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
        {bio}
      </p>
    </motion.div>
  );
};
