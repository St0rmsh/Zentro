import React from "react";
import { motion } from "framer-motion";
import { Mail, Calendar, BadgeCheck } from "lucide-react";
import { ProfileUser } from "../types/profile.types";
import { VerificationBadge } from "./VerificationBadge";

interface ProfileInfoProps {
  user: ProfileUser;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const parsedJoinDate = user.createdAt ? new Date(user.createdAt) : null;
  const joinDate = parsedJoinDate && !Number.isNaN(parsedJoinDate.getTime())
    ? parsedJoinDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "Unknown";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">{user.fullname}</h1>
          <VerificationBadge verified={Boolean(user.isVerified)} />
        </div>
        <p className="text-muted-foreground">@{user.username}</p>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-base text-foreground/90 max-w-prose">{user.bio}</p>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {user.email && (
          <div className="flex items-center gap-1.5">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>Joined {joinDate}</span>
        </div>
        {(user.isEmailVerified || user.isVerified) && (
          <div className="flex items-center gap-1.5 text-green-600">
            <BadgeCheck className="h-4 w-4" />
            <span>Email verified</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};