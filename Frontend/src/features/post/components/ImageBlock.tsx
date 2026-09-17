/**
 * ImageBlock — Lazy-loaded image with caption
 * Part of the content rendering system
 */

import { useState } from "react";
import { motion } from "framer-motion";

interface ImageBlockProps {
  src: string;
  alt?: string;
  caption?: string;
}

export function ImageBlock({ src, alt, caption }: ImageBlockProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="my-6 w-full aspect-video rounded-xl bg-muted/20 border border-border/30 flex items-center justify-center text-muted-foreground text-sm">
        Failed to load image
      </div>
    );
  }

  return (
    <figure className="my-6">
      <div className="relative w-full rounded-xl overflow-hidden bg-muted/10 border border-border/20">
        {!loaded && (
          <div className="absolute inset-0 bg-muted/20 animate-pulse" />
        )}
        <motion.img
          src={src}
          alt={alt || "Post image"}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground/70 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
