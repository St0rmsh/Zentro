import { useEffect } from "react";
import { useAppDispatch } from "../../../shared/hooks";
import { setReadingProgress, setReadingPosition } from "../state/postSlice";
import { motion, useScroll, useSpring } from "framer-motion";

export const ReadingProgress = () => {
  const dispatch = useAppDispatch();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      // Debounce saving reading position
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        dispatch(setReadingProgress(progress));
        dispatch(setReadingPosition(scrollTop));
      }, 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [dispatch]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
      style={{ scaleX }}
    />
  );
};
