import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ProfileCardProps {
  children: React.ReactNode;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-card rounded-lg md:rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
