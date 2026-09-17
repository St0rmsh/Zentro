import { useEffect, useState, useMemo } from "react";
import { TocHeading } from "../types/post.types";
import { cn } from "../../../shared/lib/utils";

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo(() => {
    const regex = /^(#{1,3})\s+(.+)$/gm;
    const matches: TocHeading[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      matches.push({
        id,
        text,
        level: match[1].length
      });
    }

    return matches;
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66% 0px" } // Adjust to trigger when heading is near the top
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for header
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="w-full bg-transparent">
      <h4 className="font-semibold text-sm tracking-tight text-foreground/90 uppercase mb-4">
        Table of Contents
      </h4>
      <nav className="flex flex-col gap-2 relative border-l border-border/40 pl-4">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => handleClick(e, heading.id)}
            className={cn(
              "text-sm transition-all duration-200 line-clamp-2",
              heading.level === 1 ? "font-medium" : heading.level === 2 ? "pl-2" : "pl-4",
              activeId === heading.id
                ? "text-primary font-semibold translate-x-1"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
};
