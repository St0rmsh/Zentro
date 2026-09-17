import { Button } from "@/shared/ui/button";
import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface SocialButtonProps {
  provider: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const SocialButton = ({ provider, icon, onClick, disabled }: SocialButtonProps) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-11 bg-background border-border hover:bg-muted"
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
        <span className="text-sm font-medium">Continue with {provider}</span>
      </Button>
    </motion.div>
  );
};
