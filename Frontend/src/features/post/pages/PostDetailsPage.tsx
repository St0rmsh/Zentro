import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks";
import { fetchPostThunk, clearPost } from "../state/postSlice";
import { PostSkeleton } from "../components/PostSkeleton";
import { PostError } from "../components/PostError";
import { PostHeader } from "../components/PostHeader";
import { PostContent } from "../components/PostContent";
import { TableOfContents } from "../components/TableOfContents";
import { ReadingControls } from "../components/ReadingControls";
import { InteractionBar } from "../components/InteractionBar";
import { RecommendationList } from "../components/RecommendationList";
import { ScrollToTopButton } from "../components/ScrollToTopButton";
import { AuthorCard } from "../components/AuthorCard";
import { CommentList } from "../../comments/components/CommentList";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/shared/components/SEO";

import { useScrollProgress } from "@/features/reading/hooks/useScrollProgress";
import { ReadingProgressBar } from "@/features/reading/components/ReadingProgressBar";
import { EstimatedReadingTime } from "@/features/reading/components/EstimatedReadingTime";
import { FocusModeButton } from "@/features/reading/components/FocusModeButton";
import { Sparkles, Loader2 } from "lucide-react";
import { axiosInstance } from "@/shared/lib/axios";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";

export const PostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentPost, loading, error, settings, readingPosition } = useAppSelector(
    (state) => state.post
  );

  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const fetchSummary = async () => {
    if (!currentPost) return;
    setIsSummaryLoading(true);
    try {
      const response = await axiosInstance.get(`/post/${currentPost._id}/summary`);
      setSummary(response.data.summary);
    } catch (err) {
      toast.error("Failed to fetch summary.");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchPostThunk(id));
    }
    return () => {
      dispatch(clearPost());
    };
  }, [dispatch, id]);

  useScrollProgress(currentPost?._id);

  // Restore reading position when post is loaded
  useEffect(() => {
    if (currentPost && readingPosition > 0) {
      // Use a slight delay to allow rendering to complete
      const timeout = setTimeout(() => {
        window.scrollTo({ top: readingPosition, behavior: "auto" });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentPost]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    if (id) {
      dispatch(fetchPostThunk(id));
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full p-4 sm:p-6 lg:p-8">
        <PostSkeleton />
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="w-full h-full p-4 sm:p-6 lg:p-8">
        <PostError message={error || "Post not found"} onRetry={handleRetry} />
      </div>
    );
  }

  const contentWidthClass =
    settings.readingWidth === "narrow"
      ? "max-w-[600px]"
      : settings.readingWidth === "wide"
        ? "max-w-[1000px]"
        : "max-w-[768px]";

  return (
    <div className="relative min-h-screen bg-background">
      <SEO 
        title={`${currentPost.title} — Zentro`}
        description={currentPost.content.substring(0, 150)}
        image={currentPost.coverImage}
        type="article"
      />
      <ReadingProgressBar />

      {/* Sticky Top Bar for Mobile */}
      <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 p-3 flex justify-between items-center">
        <h1 className="text-sm font-semibold truncate">{currentPost.title}</h1>
        <FocusModeButton />
      </div>

      <div className="flex w-full items-start justify-center pt-8 pb-32">
        {/* Left Side: Interactions */}
        <div className="hidden xl:block w-[100px] sticky top-24 mr-8 shrink-0">
          <InteractionBar postId={currentPost._id} initialLikes={currentPost.likesCount || 0} />
        </div>

        {/* Main Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto transition-all duration-300 flex flex-col`}
        >
          <div className={`w-full mx-auto transition-all duration-300 ${contentWidthClass}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <PostHeader post={currentPost} />
                <div className="mt-4 flex items-center gap-4">
                  <EstimatedReadingTime words={currentPost.content.split(/\s+/).length} />
                  <button
                    onClick={fetchSummary}
                    disabled={isSummaryLoading || !!summary}
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSummaryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    TL;DR Summary
                  </button>
                </div>
              </div>
              <div className="hidden md:block ml-4">
                <FocusModeButton />
              </div>
            </div>

            <AnimatePresence>
              {summary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-6 bg-muted/50 rounded-2xl border border-primary/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                    <Sparkles className="w-5 h-5" />
                    <h3>AI Summary</h3>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-li:marker:text-primary">
                    <ReactMarkdown>{summary}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={`mt-10 mb-16 transition-all duration-300`}
              style={{ fontSize: `${settings.fontSize}px` }}
            >
              <PostContent content={currentPost.content} fontSize={settings.fontSize} />
            </div>
          </div>

          {/* Author Card at Bottom */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <AuthorCard author={currentPost.user} />
          </div>

          {/* Interaction Bar on Mobile/Tablet */}
          <div className="xl:hidden mt-8 py-4 border-y border-border/40 flex justify-center">
            <InteractionBar orientation="horizontal" postId={currentPost._id} initialLikes={currentPost.likesCount || 0} />
          </div>

          {/* Comments Section */}
          <div className="mt-16" id="comments">
            <CommentList postId={currentPost._id} />
          </div>

          {/* Recommended Reading */}
          <div className="mt-16 border-t border-border/40 pt-16">
            <RecommendationList />
          </div>
        </motion.article>

        {/* Right Side: Table of Contents */}
        {!settings.focusMode && (
          <div className="hidden lg:block w-[280px] sticky top-24 ml-8 shrink-0 pr-4">
            <TableOfContents content={currentPost.content} />
          </div>
        )}
      </div>

      {/* Floating Controls */}
      <AnimatePresence>
        {!settings.focusMode && <ReadingControls />}
      </AnimatePresence>
      <ScrollToTopButton />
    </div>
  );
};
