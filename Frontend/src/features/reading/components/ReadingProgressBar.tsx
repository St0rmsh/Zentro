import { motion } from "framer-motion";
import { useAppSelector } from "@/shared/hooks";

export const ReadingProgressBar = () => {
  const { scrollPercentage } = useAppSelector((state) => state.reading.currentSession);
  const { focusMode } = useAppSelector((state) => state.reading.preferences);

  // In focus mode, we might want to make it even subtler
  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent">
      <motion.div 
        className={`h-full ${focusMode ? 'bg-primary/50' : 'bg-primary'} origin-left`}
        style={{ scaleX: scrollPercentage / 100 }}
        initial={{ scaleX: 0 }}
        transition={{ ease: "linear", duration: 0.1 }}
      />
    </div>
  );
};
