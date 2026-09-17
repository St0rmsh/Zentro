import React from "react";
import { motion } from "framer-motion";

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Banner skeleton */}
      <motion.div
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="h-32 md:h-48 bg-muted rounded-t-xl"
      />

      {/* Avatar and info skeleton */}
      <div className="space-y-4 px-6 pb-6">
        <motion.div
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-24 w-24 bg-muted rounded-full -mt-12 relative z-10"
        />

        <div className="space-y-3">
          <motion.div
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-6 bg-muted rounded w-40"
          />
          <motion.div
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-4 bg-muted rounded w-32"
          />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-20 bg-muted rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
