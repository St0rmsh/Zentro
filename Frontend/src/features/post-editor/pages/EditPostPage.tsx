import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileEdit,
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

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | File | null>(null);
  const [media, setMedia] = useState<File[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid post ID.");
      navigate("/posts");
      return;
    }

    const loadPost = async () => {
      try {
        setLoading(true);

        const response = await postEditorService.getPostForEdit(id);

        const post =
          response?.data?.post ||
          response?.post ||
          response?.data ||
          response;

        if (!post) {
          throw new Error("Post not found.");
        }

        setTitle(post.title || "");
        setContent(post.content || "");
        setCategory(post.category || "");
        setTags(Array.isArray(post.tags) ? post.tags : []);
        setCoverImage(post.coverImage || "");
        setIsPublished(Boolean(post.isPublished));
      } catch (error: any) {
        console.error("Load post error:", error);

        toast.error(
          error?.response?.data?.message ||
            "Unable to load this post."
        );

        navigate("/posts");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!id) {
      toast.error("Invalid post ID.");
      return;
    }

    if (!title.trim()) {
      toast.error("Please add a title.");
      return;
    }

    if (!content.trim()) {
      toast.error("Please add some content.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("content", content);
      formData.append("category", category.trim());

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

      await postEditorService.updatePost(id, formData);

      toast.success(
        isPublished
          ? "Post updated and published successfully."
          : "Post updated successfully."
      );
    } catch (error: any) {
      console.error("Update post error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update post."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading post...
        </div>
      </div>
    );
  }

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
                <FileEdit className="h-4 w-4 shrink-0 text-muted-foreground" />

                <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">
                  Edit Post
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
                  {isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                Update your investigation post
              </p>
            </div>
          </div>

          {/* Right */}
          <button
            type="button"
            onClick={handleUpdate}
            disabled={saving}
            className="
              inline-flex h-9 shrink-0 items-center gap-2
              rounded-md bg-primary px-3.5
              text-sm font-medium text-primary-foreground
              transition-colors hover:bg-primary/90
              disabled:pointer-events-none disabled:opacity-50
            "
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : isPublished ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Changes</span>
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
                <TitleInput
                  value={title}
                  onChange={setTitle}
                />
              </div>

              {/* Content */}
              <div className="px-5 py-6 sm:px-8 sm:py-7">
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-foreground">
                    Content
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Edit your investigation, analysis, or report.
                  </p>
                </div>

                <EditorContent
                  value={content}
                  onChange={setContent}
                />
              </div>

              {/* Cover */}
              <div className="border-t border-border px-5 py-6 sm:px-8 sm:py-7">
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-foreground">
                    Cover Image
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Update the visual cover for your post.
                  </p>
                </div>

                <CoverUploader
                  value={coverImage}
                  onChange={setCoverImage}
                />
              </div>

              {/* Attachments */}
              <div className="border-t border-border px-5 py-6 sm:px-8 sm:py-7">
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-foreground">
                    Attachments
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Add additional images or videos.
                  </p>
                </div>

                <MediaUploader
                  value={media}
                  onChange={setMedia}
                />
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
              onPublish={handleUpdate}
              loading={saving}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}