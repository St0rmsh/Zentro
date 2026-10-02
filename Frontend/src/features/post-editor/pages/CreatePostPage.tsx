import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "react-hot-toast";

import TitleInput from "../components/TitleInput";
import CoverUploader from "../components/CoverUploader";
import MediaUploader from "../components/MediaUploader";
import EditorContent from "../components/EditorContent";
import PublishPanel from "../components/PublishPanel";

import { postEditorService } from "../services/postEditor.service";

const MAX_TITLE_LENGTH = 120;

export default function CreatePostPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | File | null>(null);
  const [media, setMedia] = useState<File[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set to true right after a successful save so we don't warn on leaving
  const savedRef = useRef(false);

  const isDirty =
    !savedRef.current &&
    Boolean(
      title.trim() ||
        content.trim() ||
        tags.length > 0 ||
        coverImage ||
        media.length > 0
    );

  /* ---------- Warn before closing/reloading with unsaved work ---------- */
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  /* ---------- Create ---------- */
  const handleCreate = async () => {
    if (loading) return;

    if (!title.trim()) {
      toast.error("Please add a title.");
      document.getElementById("post-title")?.focus();
      return;
    }

    if (title.trim().length > MAX_TITLE_LENGTH) {
      toast.error(`Title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
      document.getElementById("post-title")?.focus();
      return;
    }

    if (!content.trim()) {
      toast.error("Please add some content.");
      document.getElementById("post-content")?.focus();
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("content", content);

      tags.forEach((tag) => {
        formData.append("tags", tag);
      });

      if (coverImage instanceof File) {
        formData.append("coverImage", coverImage);
      }

      formData.append("isPublished", String(isPublished));

      media.forEach((file) => {
        formData.append("media", file);
      });

      const response = await postEditorService.createPost(formData);

      savedRef.current = true;

      toast.success(
        isPublished
          ? "Post published successfully."
          : "Draft saved successfully."
      );

      const postId =
        response?.data?.post?._id ||
        response?.post?._id ||
        response?.data?._id ||
        response?._id;

      navigate(postId ? `/posts/${postId}` : "/posts");
    } catch (error: any) {
      console.error("Create post error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to create post."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Ctrl/⌘ + S to save ---------- */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        handleCreate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  /* ---------- Confirm before leaving via the back button ---------- */
  const handleBackClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDirty && !window.confirm("Discard this post? Your changes will be lost.")) {
      event.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/posts"
              aria-label="Back to posts"
              onClick={handleBackClick}
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-md border border-border
                bg-card text-muted-foreground
                transition-colors
                hover:bg-muted hover:text-foreground
                focus:outline-none focus:ring-2 focus:ring-ring
              "
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />

                <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">
                  Create Post
                </h1>

                <span
                  className={`
                    hidden items-center rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline-flex
                    ${
                      isPublished
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {isPublished ? "Will publish" : "Draft"}
                </span>
              </div>

              <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                {isDirty
                  ? "Unsaved changes · Ctrl/⌘ + S to save"
                  : "Create and publish a new investigation post"}
              </p>
            </div>
          </div>

          {/* Right */}
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="
              inline-flex h-9 shrink-0 items-center gap-2
              rounded-md bg-primary px-3.5
              text-sm font-medium text-primary-foreground
              transition-colors hover:bg-primary/90 active:scale-[0.98]
              focus:outline-none focus:ring-2 focus:ring-ring
              disabled:pointer-events-none disabled:opacity-50
            "
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : isPublished ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Publish</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Draft</span>
                <span className="sm:hidden">Save</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Editor */}
          <section className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {/* Title */}
              <div className="border-b border-border px-5 py-6 sm:px-8 sm:py-8">
                <TitleInput value={title} onChange={setTitle} />
              </div>

              {/* Content */}
              <div className="px-5 py-6 sm:px-8 sm:py-7">
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-foreground">
                    Content
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Write your investigation, analysis, or report.
                  </p>
                </div>

                <EditorContent value={content} onChange={setContent} />
              </div>

              {/* Cover */}
              <div className="border-t border-border px-5 py-6 sm:px-8 sm:py-7">
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-foreground">
                    Cover Image
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Add a visual cover for your post.
                  </p>
                </div>

                <CoverUploader value={coverImage} onChange={setCoverImage} />
              </div>

              {/* Attachments */}
              <div className="border-t border-border px-5 py-6 sm:px-8 sm:py-7">
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-foreground">
                    Attachments
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Add supporting images or videos to your post.
                  </p>
                </div>

                <MediaUploader value={media} onChange={setMedia} />
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24">
            <PublishPanel
              isPublished={isPublished}
              setIsPublished={setIsPublished}
              tags={tags}
              setTags={setTags}
              onPublish={handleCreate}
              loading={loading}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}