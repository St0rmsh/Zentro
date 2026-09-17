import { motion } from "framer-motion";

interface PostCoverProps {
  src: string;
  alt: string;
}

export const PostCover = ({ src, alt }: PostCoverProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full aspect-[2/1] sm:aspect-[21/9] overflow-hidden rounded-xl border border-border/50 shadow-md mb-10"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        loading="eager"
      />
    </motion.div>
  );
};
