import React from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
}) => {
  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      type="button"
      className={`
        inline-flex h-9 w-9
        items-center justify-center
        rounded-md
        transition-colors
        focus:outline-none
        focus:ring-2
        focus:ring-ring
        ${
          isActive
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }
        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : ""
        }
      `}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div className="mx-1 h-6 w-px bg-border" />
  );

  return (
    <div
      className="
        sticky top-4 z-10
        mb-4
        flex flex-wrap items-center gap-1
        rounded-xl
        border border-border
        bg-card
        p-2
        shadow-sm
      "
    >
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleBold().run()
        }
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleItalic().run()
        }
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleUnderline().run()
        }
        isActive={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleStrike().run()
        }
        isActive={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run()
        }
        isActive={editor.isActive("heading", {
          level: 1,
        })}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }
        isActive={editor.isActive("heading", {
          level: 2,
        })}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run()
        }
        isActive={editor.isActive("heading", {
          level: 3,
        })}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
        isActive={editor.isActive("orderedList")}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleBlockquote().run()
        }
        isActive={editor.isActive("blockquote")}
        title="Quote"
      >
        <Quote size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleCodeBlock().run()
        }
        isActive={editor.isActive("codeBlock")}
        title="Code Block"
      >
        <Code size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().setHorizontalRule().run()
        }
        title="Horizontal Rule"
      >
        <Minus size={18} />
      </ToolbarButton>
    </div>
  );
};