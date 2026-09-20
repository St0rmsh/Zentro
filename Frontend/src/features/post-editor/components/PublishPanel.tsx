import { Check, Globe2, Hash, Lock, Send, X } from "lucide-react";
import { useState } from "react";

interface PublishPanelProps {
  isPublished: boolean;
  setIsPublished: (value: boolean) => void;
  tags: string[];
  setTags: (value: string[]) => void;
  onPublish: () => void;
  loading: boolean;
}

export default function PublishPanel({
  isPublished,
  setIsPublished,
  tags,
  setTags,
  onPublish,
  loading,
}: PublishPanelProps) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, "");
    if (!tag) return;

    if (
      tags.some(
        (existingTag) => existingTag.toLowerCase() === tag.toLowerCase()
      )
    ) {
      setTagInput("");
      return;
    }

    setTags([...tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((item) => item !== tag));
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
      return;
    }

    if (event.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">Audience</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose who can see this post.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1">
          <button
            type="button"
            disabled={loading}
            onClick={() => setIsPublished(false)}
            className={`
              flex items-center justify-center gap-1.5 rounded-md px-3 py-2
              text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring
              ${
                !isPublished
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            <Lock size={14} />
            Draft
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => setIsPublished(true)}
            className={`
              flex items-center justify-center gap-1.5 rounded-md px-3 py-2
              text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring
              ${
                isPublished
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            <Globe2 size={14} />
            Published
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {isPublished
            ? "Visible to everyone as soon as you publish."
            : "Only visible to you until you publish it."}
        </p>

        <button
          type="button"
          onClick={onPublish}
          disabled={loading}
          className="
            mt-5 flex w-full items-center justify-center gap-2 rounded-lg
            bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground
            transition-colors hover:bg-primary/90
            disabled:cursor-not-allowed disabled:opacity-60
            focus:outline-none focus:ring-2 focus:ring-ring
          "
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : isPublished ? (
            <>
              <Send size={16} />
              Publish Post
            </>
          ) : (
            <>
              <Check size={16} />
              Save Draft
            </>
          )}
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Hash size={17} className="text-muted-foreground" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">Tags</h2>
            <p className="text-xs text-muted-foreground">
              Help organize your post.
            </p>
          </div>
        </div>

        <div
          className="
            flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-lg
            border border-input bg-background px-2.5 py-2
            focus-within:border-ring focus-within:ring-2 focus-within:ring-ring
          "
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="
                inline-flex items-center gap-1 rounded-full bg-muted/70
                px-2.5 py-1 text-xs font-medium text-foreground
              "
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="rounded-full text-muted-foreground transition-colors hover:text-destructive focus:outline-none"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          <input
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={addTag}
            placeholder={tags.length === 0 ? "Add a tag..." : ""}
            className="
              min-w-[80px] flex-1 border-0 bg-transparent px-1 py-1
              text-sm text-foreground outline-none
              placeholder:text-muted-foreground
              focus:ring-0
            "
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Press Enter or comma to add a tag.
        </p>
      </div>
    </div>
  );
}