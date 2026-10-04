import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bold,
  Code2,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Sparkles,
} from "lucide-react";
import { axiosInstance } from "@/shared/lib/axios";

interface EditorContentProps {
  value: string;
  onChange: (value: string) => void;
}

type ToolbarAction = {
  label: string;
  shortcut?: string;
  icon: typeof Bold;
  action: () => void;
};

const MIN_HEIGHT = 420;

export default function EditorContent({ value, onChange }: EditorContentProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ---------- Auto-grow textarea ---------- */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(textarea.scrollHeight, MIN_HEIGHT)}px`;
  }, [value]);

  /* ---------- Apply a change and restore the selection ---------- */
  const applyChange = useCallback(
    (newValue: string, selStart: number, selEnd: number) => {
      onChange(newValue);

      requestAnimationFrame(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.focus();
        textarea.setSelectionRange(selStart, selEnd);
      });
    },
    [onChange]
  );

  /* ---------- Wrap / unwrap selection (bold, italic, code, link) ---------- */
  const wrapSelection = (
    prefix: string,
    suffix = prefix,
    placeholder = "text"
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);

    const alreadyWrapped =
      start >= prefix.length &&
      value.slice(start - prefix.length, start) === prefix &&
      value.slice(end, end + suffix.length) === suffix;

    // Toggle off
    if (alreadyWrapped) {
      const newValue =
        value.slice(0, start - prefix.length) +
        selected +
        value.slice(end + suffix.length);

      applyChange(newValue, start - prefix.length, end - prefix.length);
      return;
    }

    const text = selected || placeholder;
    const newValue =
      value.slice(0, start) + prefix + text + suffix + value.slice(end);

    applyChange(
      newValue,
      start + prefix.length,
      start + prefix.length + text.length
    );
  };

  /* ---------- Prefix whole lines (heading, quote, lists) ---------- */
  const toggleLinePrefix = (getPrefix: (index: number) => string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const nextBreak = value.indexOf("\n", end);
    const lineEnd = nextBreak === -1 ? value.length : nextBreak;

    const lines = value.slice(lineStart, lineEnd).split("\n");

    const allPrefixed = lines.every((line, i) =>
      line.startsWith(getPrefix(i))
    );

    const updated = lines.map((line, i) =>
      allPrefixed ? line.slice(getPrefix(i).length) : getPrefix(i) + line
    );

    const block = updated.join("\n");
    const newValue = value.slice(0, lineStart) + block + value.slice(lineEnd);

    applyChange(newValue, lineStart, lineStart + block.length);
  };

  /* ---------- Specific actions ---------- */
  const handleBold = () => wrapSelection("**", "**", "bold text");
  const handleItalic = () => wrapSelection("*", "*", "italic text");

  const handleCode = () => {
    const textarea = textareaRef.current;
    const selected = textarea
      ? value.slice(textarea.selectionStart, textarea.selectionEnd)
      : "";

    if (selected.includes("\n")) {
      wrapSelection("```\n", "\n```", "code");
    } else {
      wrapSelection("`", "`", "code");
    }
  };

  const handleLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const label = value.slice(start, end) || "link text";
    const url = "https://";

    const insertion = `[${label}](${url})`;
    const newValue = value.slice(0, start) + insertion + value.slice(end);

    // Select the URL so it can be typed over immediately
    const urlStart = start + label.length + 3;
    applyChange(newValue, urlStart, urlStart + url.length);
  };

  /* ---------- Keyboard shortcuts & smart editing ---------- */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = event.ctrlKey || event.metaKey;

    if (mod && event.key.toLowerCase() === "b") {
      event.preventDefault();
      handleBold();
      return;
    }

    if (mod && event.key.toLowerCase() === "i") {
      event.preventDefault();
      handleItalic();
      return;
    }

    if (mod && event.key.toLowerCase() === "k") {
      event.preventDefault();
      handleLink();
      return;
    }

    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Tab inserts indentation instead of leaving the field
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      const newValue = value.slice(0, start) + "  " + value.slice(end);
      applyChange(newValue, start + 2, start + 2);
      return;
    }

    // Continue lists on Enter
    if (event.key === "Enter" && !event.shiftKey && start === end) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const currentLine = value.slice(lineStart, start);

      const bullet = currentLine.match(/^(\s*)([-*])\s(.*)$/);
      const numbered = currentLine.match(/^(\s*)(\d+)\.\s(.*)$/);

      if (bullet || numbered) {
        event.preventDefault();

        const content = (bullet ? bullet[3] : numbered![3]) ?? "";

        // Empty list item: exit the list
        if (!content.trim()) {
          const newValue = value.slice(0, lineStart) + value.slice(start);
          applyChange(newValue, lineStart, lineStart);
          return;
        }

        const indent = bullet ? bullet[1] : numbered![1];
        const marker = bullet
          ? `${bullet[2]} `
          : `${Number(numbered![2]) + 1}. `;

        const insertion = `\n${indent}${marker}`;
        const newValue = value.slice(0, start) + insertion + value.slice(end);
        const cursor = start + insertion.length;
        applyChange(newValue, cursor, cursor);
      }
    }
  };

  /* ---------- AI Assistant Actions ---------- */
  const [isAILoading, setIsAILoading] = useState(false);

  const handleAIFix = async (endpoint: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);

    if (!selected) {
        alert("Please select some text first.");
        return;
    }

    setIsAILoading(true);
    try {
        const response = await axiosInstance.post(`/ai/writing/${endpoint}`, { content: selected });
        const newText = response.data.data;
        const newValue = value.slice(0, start) + newText + value.slice(end);
        applyChange(newValue, start, start + newText.length);
    } catch (e) {
        console.error("AI fix failed");
    } finally {
        setIsAILoading(false);
    }
  };

  /* ---------- Toolbar ---------- */
  const toolbarGroups: ToolbarAction[][] = [
    [
      { label: "AI Grammar Fix", icon: Sparkles, action: () => handleAIFix("grammar-fix") },
      { label: "AI Shorten", icon: Sparkles, action: () => handleAIFix("shorten") },
    ],
    [
      { label: "Bold", shortcut: "Ctrl+B", icon: Bold, action: handleBold },
      { label: "Italic", shortcut: "Ctrl+I", icon: Italic, action: handleItalic },
    ],
    [
      {
        label: "Heading",
        icon: Heading2,
        action: () => toggleLinePrefix(() => "## "),
      },
      {
        label: "Quote",
        icon: Quote,
        action: () => toggleLinePrefix(() => "> "),
      },
    ],
    [
      {
        label: "Bullet list",
        icon: List,
        action: () => toggleLinePrefix(() => "- "),
      },
      {
        label: "Numbered list",
        icon: ListOrdered,
        action: () => toggleLinePrefix((i) => `${i + 1}. `),
      },
    ],
    [
      { label: "Code", icon: Code2, action: handleCode },
      { label: "Link", shortcut: "Ctrl+K", icon: Link2, action: handleLink },
    ],
  ];

  /* ---------- Stats ---------- */
  const wordCount = useMemo(
    () => (value.trim() ? value.trim().split(/\s+/).length : 0),
    [value]
  );

  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <div
      className="
        relative isolate overflow-hidden rounded-xl
        border border-border bg-background
        transition-colors
        focus-within:border-ring focus-within:ring-1 focus-within:ring-ring
      "
    >
      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="relative z-10 flex flex-wrap items-center gap-1 border-b border-border bg-muted/60 p-2"
      >
        {toolbarGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center gap-1">
            {group.map(({ label, shortcut, icon: Icon, action }) => (
              <button
                key={label}
                type="button"
                onClick={action}
                disabled={isAILoading && label.includes("AI")}
                title={shortcut ? `${label} (${shortcut})` : label}
                aria-label={label}
                className={`
                  inline-flex h-9 w-9 items-center justify-center rounded-md
                  text-muted-foreground transition-colors
                  hover:bg-background hover:text-foreground
                  active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-ring
                  ${label.includes("AI") ? "text-primary hover:text-primary" : ""}
                  ${isAILoading && label.includes("AI") ? "opacity-50 animate-pulse" : ""}
                `}
              >
                <Icon size={16} />
              </button>
            ))}

            {groupIndex < toolbarGroups.length - 1 && (
              <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      {/* Writing area */}
      <textarea
        id="post-content"
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Start writing your post..."
        spellCheck
        rows={14}
        className="
          relative z-0 block w-full resize-none
          border-0 bg-transparent
          p-5 font-serif text-base leading-8
          text-foreground caret-foreground
          outline-none placeholder:font-sans placeholder:text-muted-foreground
          focus:ring-0 sm:p-6
        "
        style={{ minHeight: MIN_HEIGHT }}
      />

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <span>
          Markdown supported · Ctrl/⌘ + B bold · I italic · K link
        </span>

        <span className="tabular-nums">
          {wordCount} {wordCount === 1 ? "word" : "words"} · {readingMinutes} min
          read
        </span>
      </div>
    </div>
  );
}