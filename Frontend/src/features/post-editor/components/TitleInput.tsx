import { useEffect, useRef } from "react";
import { FileText } from "lucide-react";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Id of the element to focus when the user presses Enter */
  nextFieldId?: string;
}

const MAX_TITLE_LENGTH = 120;
const WARN_THRESHOLD = 0.9;

export default function TitleInput({
  value,
  onChange,
  nextFieldId = "post-content",
}: TitleInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ---------- Auto-grow ---------- */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  /* ---------- Keep the title on a single logical line ---------- */
  const sanitize = (text: string) =>
    text.replace(/\s*\n+\s*/g, " ").slice(0, MAX_TITLE_LENGTH);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(sanitize(event.target.value));
  };

  /* Enter moves to the content editor instead of adding a new line */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById(nextFieldId)?.focus();
    }
  };

  const length = value.length;
  const atLimit = length >= MAX_TITLE_LENGTH;
  const nearLimit = length >= MAX_TITLE_LENGTH * WARN_THRESHOLD;

  const counterClass = atLimit
    ? "text-destructive font-medium"
    : nearLimit
    ? "text-foreground font-medium"
    : "text-muted-foreground";

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label
          htmlFor="post-title"
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <FileText size={16} />
          Post Title
        </label>

        <span
          id="post-title-counter"
          aria-live="polite"
          className={`text-xs tabular-nums transition-colors ${counterClass}`}
        >
          {length}/{MAX_TITLE_LENGTH}
        </span>
      </div>

      <textarea
        id="post-title"
        ref={textareaRef}
        rows={1}
        value={value}
        maxLength={MAX_TITLE_LENGTH}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-describedby="post-title-counter post-title-hint"
        placeholder="Enter a compelling title..."
        spellCheck
        autoComplete="off"
        className="
          block w-full resize-none overflow-hidden
          border-0 bg-transparent
          font-serif text-2xl font-bold leading-snug
          text-foreground caret-foreground outline-none
          placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground
          focus:ring-0
          sm:text-3xl
        "
      />

      <p
        id="post-title-hint"
        className="mt-3 text-xs text-muted-foreground"
      >
        {atLimit
          ? "You've reached the title limit."
          : "Keep your title clear, specific, and easy to understand. Press Enter to jump to the content."}
      </p>
    </div>
  );
}