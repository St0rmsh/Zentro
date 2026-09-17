import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthCard = ({ title, description, children, footer }: AuthCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="w-full rounded-xl shadow-2xl border border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-50 pointer-events-none" />

        <CardHeader className="space-y-2 text-center sm:text-left pt-8 pb-2 px-6 sm:px-8 relative z-10">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</CardTitle>
          {description && (
            <CardDescription className="text-base text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="px-6 sm:px-8 pb-6 pt-2 relative z-10">
          {children}
        </CardContent>

        {footer && (
          <div className="px-6 sm:px-8 pb-6 text-center text-sm text-muted-foreground relative z-10">
            {footer}
          </div>
        )}
      </Card>
    </motion.div>
  );
};
