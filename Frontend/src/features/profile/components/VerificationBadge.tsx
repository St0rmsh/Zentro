import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface VerificationBadgeProps {
  verified: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ verified, className }) => {
  if (!verified) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn("inline-flex", className)}
      title="Verified account"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#3b82f6"
          d="M12 2.5l2.4 1.2 2.66-.4 1.3 2.34 2.34 1.3-.4 2.66L21.5 12l-1.2 2.4.4 2.66-2.34 1.3-1.3 2.34-2.66-.4L12 21.5l-2.4-1.2-2.66.4-1.3-2.34-2.34-1.3.4-2.66L2.5 12l1.2-2.4-.4-2.66 2.34-1.3 1.3-2.34 2.66.4L12 2.5z"
        />
        <path
          d="M8.5 12.2l2.3 2.3 4.7-4.7"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
};