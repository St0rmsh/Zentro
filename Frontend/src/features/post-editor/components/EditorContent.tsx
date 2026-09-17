import {
  Bold,
  Code2,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

interface EditorContentProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EditorContent({
  value,
  onChange,
}: EditorContentProps) {
  const insertMarkdown = (
    prefix: string,
    suffix = ""
  ) => {
    const textarea = document.getElementById(
      "post-content"
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = value.slice(start, end);

    const replacement =
      prefix + selectedText + suffix;

    const newValue =
      value.slice(0, start) +
      replacement +
      value.slice(end);

    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();

      const cursorPosition =
        start +
        prefix.length +
        selectedText.length +
        suffix.length;

      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    });
  };

  const toolbar = [
    {
      label: "Bold",
      icon: Bold,
      action: () => insertMarkdown("**", "**"),
    },
    {
      label: "Italic",
      icon: Italic,
      action: () => insertMarkdown("*", "*"),
    },
    {
      label: "Heading",
      icon: Heading2,
      action: () => insertMarkdown("## "),
    },
    {
      label: "Quote",
      icon: Quote,
      action: () => insertMarkdown("> "),
    },
    {
      label: "Bullet list",
      icon: List,
      action: () => insertMarkdown("- "),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      action: () => insertMarkdown("1. "),
    },
    {
      label: "Code",
      icon: Code2,
      action: () => insertMarkdown("`", "`"),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2">
        {toolbar.map(
          ({
            label,
            icon: Icon,
            action,
          }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              title={label}
              aria-label={label}
              className="
                inline-flex h-9 w-9 items-center justify-center
                rounded-md
                text-muted-foreground
                transition-colors
                hover:bg-background
                hover:text-foreground
                focus:outline-none
                focus:ring-2
                focus:ring-ring
              "
            >
              <Icon size={16} />
            </button>
          )
        )}
      </div>

      {/* Editor */}
      <textarea
        id="post-content"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Start writing your post..."
        spellCheck
        className="
          min-h-[420px]
          w-full
          resize-y
          border-0
          bg-background
          p-5
          text-sm
          leading-7
          text-foreground
          outline-none
          placeholder:text-muted-foreground
          focus:ring-0
          sm:p-6
        "
      />

      {/* Footer */}
      <div
        className="
          border-t border-border
          bg-muted/40
          px-4 py-2
          text-xs
          text-muted-foreground
        "
      >
        Markdown formatting is supported.
      </div>
    </div>
  );
}