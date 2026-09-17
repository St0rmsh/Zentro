import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number; // Positive or negative percentage
  trendLabel?: string;
  className?: string;
}

export const StatsCard = ({ title, value, icon, trend, trendLabel, className = "" }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight mt-2">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
          <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? "text-emerald-500" : "text-destructive"}`}>
            {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
          {trendLabel && <p className="text-sm text-muted-foreground">{trendLabel}</p>}
        </div>
      )}
    </motion.div>
  );
};
