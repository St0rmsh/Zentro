import { useEffect, useState } from "react";
import { Button } from "../../../shared/ui/button";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12"
        >
          <Button
            variant="secondary"
            size="icon"
            onClick={scrollToTop}
            className="h-12 w-12 rounded-full shadow-lg border border-border/50 hover:bg-muted/80 backdrop-blur-md"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
