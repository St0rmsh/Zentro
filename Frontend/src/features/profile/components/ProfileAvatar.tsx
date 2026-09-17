import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ProfileAvatarProps {
  avatarUrl?: string;
  fullname?: string;
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  fullname,
  className,
}) => {
  const initials = fullname
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "relative h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-card bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden shadow-lg",
        className
      )}
    >
      {avatarUrl ? (
        <motion.img
          src={avatarUrl}
          alt={fullname || "User avatar"}
          className="h-full w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <span className="text-xl md:text-2xl font-bold text-white">{initials}</span>
      )}
    </motion.div>
  );
};
