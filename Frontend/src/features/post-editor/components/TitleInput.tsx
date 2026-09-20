import { useEffect, useRef } from "react";
import { FileText } from "lucide-react";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_TITLE_LENGTH = 120;

export default function TitleInput({ value, onChange }: TitleInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

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
          className={`text-xs tabular-nums ${
            value.length > MAX_TITLE_LENGTH
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {value.length}/{MAX_TITLE_LENGTH}
        </span>
      </div>

      <textarea
        id="post-title"
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter a compelling title..."
        className="
          w-full resize-none
          border-0 bg-transparent
          font-serif text-2xl font-bold leading-snug
          text-foreground outline-none
          placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground
          focus:ring-0
          sm:text-3xl
        "
      />

      <p className="mt-3 text-xs text-muted-foreground">
        Keep your title clear, specific, and easy to understand.
      </p>
    </div>
  );
}