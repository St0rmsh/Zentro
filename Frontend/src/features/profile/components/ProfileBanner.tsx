import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ProfileBannerProps {
  bannerUrl?: string;
  className?: string;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({ bannerUrl, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative w-full h-32 md:h-48 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-t-xl border border-b-0 overflow-hidden group",
        className
      )}
    >
      {bannerUrl && (
        <motion.img
          src={bannerUrl}
          alt="Profile banner"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {!bannerUrl && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20" />
      )}
    </motion.div>
  );
};
