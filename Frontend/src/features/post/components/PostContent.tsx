/**
 * PostContent — Main content renderer
 * Parses plain text content into structured blocks:
 * headings, paragraphs, code blocks, blockquotes, lists, images
 *
 * Architecture is future-ready for full markdown support
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CodeBlock } from "./CodeBlock";
import { QuoteBlock } from "./QuoteBlock";
import type { TocHeading } from "../types/post.types";

interface PostContentProps {
  content: string;
  fontSize: number;
  onHeadingsExtracted?: (headings: TocHeading[]) => void;
}

interface ContentBlock {
  type: "heading" | "paragraph" | "code" | "quote" | "list" | "image";
  content: string;
  level?: number; // For headings
  language?: string; // For code blocks
  items?: string[]; // For lists
  id?: string; // For headings (anchor)
}

function normalizeEditorHtml(content: string): string {
  if (!/<[a-z][\s\S]*>/i.test(content)) return content;

  const document = new DOMParser().parseFromString(content, "text/html");
  document.querySelectorAll("br").forEach((element) => element.replaceWith("\n"));
  document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, blockquote, pre, ul, ol").forEach((element) => {
    element.insertAdjacentText("afterend", "\n");
  });
  document.querySelectorAll("li").forEach((element) => {
    element.insertAdjacentText("afterbegin", "- ");
  });

  return (document.body.textContent || "")
    .replace(/\u00a0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Parse plain text content into structured blocks
 * Supports basic patterns:
 * - Lines starting with # for headings
 * - Lines starting with > for blockquotes
 * - Lines wrapped in ``` for code blocks
 * - Lines starting with - or * for lists
 * - Empty lines as paragraph separators
 */
function parseContent(content: string): ContentBlock[] {
  const lines = normalizeEditorHtml(content).split("\n");
  const blocks: ContentBlock[] = [];
  let currentParagraph: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = "";
  let quoteLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join("\n").trim();
      if (text) {
        blocks.push({ type: "paragraph", content: text });
      }
      currentParagraph = [];
    }
  };

  const flushQuote = () => {
    if (quoteLines.length > 0) {
      blocks.push({
        type: "quote",
        content: quoteLines.join("\n"),
      });
      quoteLines = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({
        type: "list",
        content: listItems.join("\n"),
        items: [...listItems],
      });
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        blocks.push({
          type: "code",
          content: codeLines.join("\n"),
          language: codeLang,
        });
        codeLines = [];
        codeLang = "";
        inCodeBlock = false;
      } else {
        // Start code block
        flushParagraph();
        flushQuote();
        flushList();
        inCodeBlock = true;
        codeLang = line.trim().replace("```", "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    // Empty line — flush current paragraph
    if (trimmed === "") {
      flushParagraph();
      flushQuote();
      flushList();
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushQuote();
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      blocks.push({ type: "heading", content: text, level, id });
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      quoteLines.push(trimmed.slice(2));
      continue;
    }

    // List item
    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      flushQuote();
      listItems.push(trimmed.replace(/^[-*]\s+/, ""));
      continue;
    }

    // Regular paragraph line
    flushQuote();
    flushList();
    currentParagraph.push(line);
  }

  // Flush remaining
  if (inCodeBlock && codeLines.length > 0) {
    blocks.push({
      type: "code",
      content: codeLines.join("\n"),
      language: codeLang,
    });
  }
  flushParagraph();
  flushQuote();
  flushList();

  return blocks;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function PostContent({
  content,
  fontSize,
  onHeadingsExtracted,
}: PostContentProps) {
  const blocks = useMemo(() => {
    const parsed = parseContent(content);

    // Extract headings for ToC
    if (onHeadingsExtracted) {
      const headings: TocHeading[] = parsed
        .filter((b) => b.type === "heading")
        .map((b) => ({
          id: b.id || generateSlug(b.content),
          text: b.content,
          level: b.level || 2,
        }));
      onHeadingsExtracted(headings);
    }

    return parsed;
  }, [content, onHeadingsExtracted]);

  return (
    <div
      className="post-content leading-relaxed text-foreground/90"
      style={{ fontSize: `${fontSize}px` }}
    >
      {blocks.map((block, index) => {
        const delay = Math.min(index * 0.03, 0.5);

        switch (block.type) {
          case "heading": {
            const Tag = `h${Math.min(
              block.level || 2,
              6
            )}` as any;
            const headingSizes: Record<number, string> = {
              1: "text-3xl font-bold mt-10 mb-4",
              2: "text-2xl font-bold mt-8 mb-3",
              3: "text-xl font-semibold mt-6 mb-2",
              4: "text-lg font-semibold mt-5 mb-2",
              5: "text-base font-semibold mt-4 mb-1",
              6: "text-sm font-semibold mt-3 mb-1",
            };

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay }}
              >
                <Tag
                  id={block.id}
                  className={`${headingSizes[block.level || 2]} text-foreground tracking-tight scroll-mt-20`}
                >
                  {block.content}
                </Tag>
              </motion.div>
            );
          }

          case "paragraph":
            return (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay }}
                className="mb-5 leading-[1.8] text-foreground/85"
              >
                {block.content}
              </motion.p>
            );

          case "code":
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay }}
              >
                <CodeBlock
                  code={block.content}
                  language={block.language}
                />
              </motion.div>
            );

          case "quote":
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay }}
              >
                <QuoteBlock>{block.content}</QuoteBlock>
              </motion.div>
            );

          case "list":
            return (
              <motion.ul
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay }}
                className="my-4 ml-6 space-y-1.5 list-disc text-foreground/85"
              >
                {block.items?.map((item, i) => (
                  <li key={i} className="leading-relaxed pl-1">
                    {item}
                  </li>
                ))}
              </motion.ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
