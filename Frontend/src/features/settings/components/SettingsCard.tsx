import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SettingsCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  overflow?: "hidden" | "visible";
}

export const SettingsCard = ({
  title,
  description,
  children,
  className = "",
  overflow = "hidden",
}: SettingsCardProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className={[
        "rounded-xl",
        "border border-border",
        "bg-card",
        "shadow-sm",
        overflow === "visible" ? "overflow-visible" : "overflow-hidden",
        className,
      ].join(" ")}
    >
      {(title || description) && (
        <div className="relative border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-8 w-1 shrink-0 rounded-full bg-primary/70" />

            <div className="min-w-0">
              {title && (
                <h3 className="text-[15px] font-semibold leading-6 tracking-tight text-foreground">
                  {title}
                </h3>
              )}

              {description && (
                <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        {children}
      </div>
    </motion.section>
  );
};