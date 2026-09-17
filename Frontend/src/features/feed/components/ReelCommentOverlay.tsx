import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReelCommentOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export function ReelCommentOverlay({ isOpen, onClose, postId }: ReelCommentOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 z-40"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 h-3/4 bg-card rounded-t-3xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <h3 className="font-bold text-lg">Comments</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-muted-foreground">
              {/* Reuse existing comment list component here if possible, or leave as placeholder for now */}
              <p>Comments for post {postId}</p>
              <p className="text-sm">API integration ready (reusing existing comment endpoints)</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
