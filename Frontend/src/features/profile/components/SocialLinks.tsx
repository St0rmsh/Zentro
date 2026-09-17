import React from "react";
import { motion } from "framer-motion";
import {  Globe } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface SocialLink {
  platform:  "website";
  url: string;
  username?: string;
}

interface SocialLinksProps {
  links?: SocialLink[];
  className?: string;
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  website: <Globe className="h-4 w-4" />,
};

const SOCIAL_LABELS: Record<string, string> = {
  website: "Website",
};

export const SocialLinks: React.FC<SocialLinksProps> = ({ links = [], className }) => {
  if (links.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn("flex gap-2 flex-wrap", className)}
    >
      {links.map((link, index) => (
        <motion.a
          key={`${link.platform}-${index}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            title={SOCIAL_LABELS[link.platform]}
          >
            {SOCIAL_ICONS[link.platform]}
            <span className="hidden sm:inline text-xs">{SOCIAL_LABELS[link.platform]}</span>
          </Button>
        </motion.a>
      ))}
    </motion.div>
  );
};
