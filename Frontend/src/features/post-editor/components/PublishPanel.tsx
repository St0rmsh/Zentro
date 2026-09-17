import {
  Check,
  Globe2,
  Hash,
  Lock,
  Plus,
  Send,
  X,
} from "lucide-react";
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
        (existingTag) =>
          existingTag.toLowerCase() === tag.toLowerCase()
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

  const handleTagKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-4">
      {/* Publishing */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Send
              size={17}
              className="text-muted-foreground"
            />

            <h2 className="text-sm font-semibold text-foreground">
              Publishing
            </h2>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Choose how this post should be saved.
          </p>
        </div>

        {/* Draft */}
        <button
          type="button"
          disabled={loading}
          onClick={() => setIsPublished(false)}
          className={`
            mb-2 w-full rounded-lg border p-3 text-left
            transition-colors
            focus:outline-none
            focus:ring-2
            focus:ring-ring
            ${
              !isPublished
                ? "border-foreground/30 bg-muted/50"
                : "border-border hover:bg-muted/40"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
                flex h-9 w-9 items-center justify-center
                rounded-md
                ${
                  !isPublished
                    ? "bg-background text-foreground"
                    : "bg-muted text-muted-foreground"
                }
              `}
            >
              <Lock size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                Draft
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Only you can access it.
              </p>
            </div>

            {!isPublished && (
              <Check
                size={17}
                className="text-foreground"
              />
            )}
          </div>
        </button>

        {/* Published */}
        <button
          type="button"
          disabled={loading}
          onClick={() => setIsPublished(true)}
          className={`
            w-full rounded-lg border p-3 text-left
            transition-colors
            focus:outline-none
            focus:ring-2
            focus:ring-ring
            ${
              isPublished
                ? "border-foreground/30 bg-muted/50"
                : "border-border hover:bg-muted/40"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
                flex h-9 w-9 items-center justify-center
                rounded-md
                ${
                  isPublished
                    ? "bg-background text-foreground"
                    : "bg-muted text-muted-foreground"
                }
              `}
            >
              <Globe2 size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                Published
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Make this post visible.
              </p>
            </div>

            {isPublished && (
              <Check
                size={17}
                className="text-foreground"
              />
            )}
          </div>
        </button>

        {/* Action */}
        <button
          type="button"
          onClick={onPublish}
          disabled={loading}
          className="
            mt-5 flex w-full items-center justify-center gap-2
            rounded-lg
            bg-primary
            px-4 py-3
            text-sm font-semibold
            text-primary-foreground
            transition-colors
            hover:bg-primary/90
            disabled:cursor-not-allowed
            disabled:opacity-60
            focus:outline-none
            focus:ring-2
            focus:ring-ring
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

      {/* Tags */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Hash
            size={17}
            className="text-muted-foreground"
          />

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Tags
            </h2>

            <p className="text-xs text-muted-foreground">
              Help organize your post.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(event) =>
              setTagInput(event.target.value)
            }
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag..."
            className="
              min-w-0 flex-1
              rounded-lg
              border border-input
              bg-background
              px-3 py-2.5
              text-sm
              text-foreground
              outline-none
              transition-colors
              placeholder:text-muted-foreground
              focus:border-ring
              focus:ring-2
              focus:ring-ring
            "
          />

          <button
            type="button"
            onClick={addTag}
            className="
              inline-flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-lg
              bg-primary
              text-primary-foreground
              transition-colors
              hover:bg-primary/90
              focus:outline-none
              focus:ring-2
              focus:ring-ring
            "
            aria-label="Add tag"
          >
            <Plus size={17} />
          </button>
        </div>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  border border-border
                  bg-muted/50
                  px-3 py-1.5
                  text-xs font-medium
                  text-foreground
                "
              >
                #{tag}

                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="
                    rounded-full
                    text-muted-foreground
                    transition-colors
                    hover:text-destructive
                    focus:outline-none
                  "
                  aria-label={`Remove ${tag}`}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}

        {tags.length === 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            No tags added yet.
          </p>
        )}
      </div>
    </div>
  );
}