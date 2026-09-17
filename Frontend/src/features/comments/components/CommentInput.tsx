import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Loader2, Send, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment is too long (max 2000 characters)"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentInputProps {
  currentUser?: {
    fullname: string;
    username: string;
    avatar?: string;
  };
  onSubmit: (content: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
  initialValue?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  currentUser,
  onSubmit,
  isLoading,
  placeholder = "Write a comment...",
  initialValue = "",
  autoFocus = false,
  onCancel,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: initialValue,
    },
    mode: "onChange",
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const currentContent = watch("content") || "";
    setValue("content", currentContent + emojiData.emoji, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const { ref, ...rest } = register("content");
  const contentValue = watch("content");

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [contentValue]);

  // Handle Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmitHandler)();
    }
  };

  const onSubmitHandler = async (data: CommentFormValues) => {
    if (!isValid || isLoading) return;
    await onSubmit(data.content);
    reset(); // Reset form after successful submission
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Determine if it's the edit mode based on if onCancel is provided
  const isEditMode = !!onCancel;

  return (
    <div className={`flex gap-4 w-full ${isEditMode ? "" : "p-4 border rounded-xl bg-card"}`}>
      {!isEditMode && currentUser && (
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
          <AvatarFallback>{currentUser.fullname.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <form onSubmit={handleSubmit(onSubmitHandler)} className="flex-1 flex flex-col gap-2 relative">
        <Textarea
          {...rest}
          ref={(e) => {
            ref(e);
            textareaRef.current = e;
          }}
          placeholder={placeholder}
          className="min-h-[44px] resize-none overflow-hidden bg-transparent border-none focus-visible:ring-0 px-0 py-2 text-base w-full shadow-none"
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoFocus={autoFocus}
        />
        
        {/* Character Count & Error */}
        <AnimatePresence>
          {errors.content && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-destructive"
            >
              {errors.content.message}
            </motion.p>
          )}
        </AnimatePresence>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
          <div className="text-xs text-muted-foreground">
            {contentValue.length}/2000
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <Smile className="h-5 w-5" />
              </Button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 z-50 right-0">
                  <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.AUTO} />
                </div>
              )}
            </div>
            {isEditMode && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={!isValid || isLoading || (!isDirty && isEditMode)}
              className="gap-2 rounded-full px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isEditMode ? "Save" : "Post"}
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
