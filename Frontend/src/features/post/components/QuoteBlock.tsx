/**
 * QuoteBlock — Styled blockquote
 * Part of the content rendering system
 */

interface QuoteBlockProps {
  children: React.ReactNode;
  cite?: string;
}

export function QuoteBlock({ children, cite }: QuoteBlockProps) {
  return (
    <blockquote className="my-6 relative pl-6 border-l-[3px] border-primary/40 py-3">
      <div className="text-foreground/80 italic leading-relaxed text-[1.05em]">
        {children}
      </div>
      {cite && (
        <cite className="block mt-2 text-xs text-muted-foreground not-italic">
          — {cite}
        </cite>
      )}
    </blockquote>
  );
}
