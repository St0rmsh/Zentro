import { motion } from "framer-motion";

interface SettingsHeaderProps {
  title: string;
  description?: string;
}

export const SettingsHeader = ({ title, description }: SettingsHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground mt-2 text-base">{description}</p>}
    </motion.div>
  );
};
