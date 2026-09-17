import { useState, ImgHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  /** ImageKit parameters for transformation, e.g., 'tr:w-400,h-300' */
  transformation?: string;
  /** Use blur placeholder if true */
  blurPlaceholder?: boolean;
}

export const Image = ({
  src,
  alt,
  className,
  transformation,
  blurPlaceholder = true,
  ...props
}: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageKitUrl = import.meta.env.VITE_IMAGEKIT_URL || '';
  
  let finalSrc = src;
  let blurSrc = '';

  if (imageKitUrl && src.startsWith(imageKitUrl)) {
    if (transformation) {
      const parts = src.split(imageKitUrl);
      if (parts.length === 2) {
         finalSrc = `${imageKitUrl}/${transformation}${parts[1]}`;
         blurSrc = `${imageKitUrl}/tr:bl-10,q-20${parts[1]}`;
      }
    } else if (blurPlaceholder) {
      const parts = src.split(imageKitUrl);
      if (parts.length === 2) {
         blurSrc = `${imageKitUrl}/tr:bl-10,q-20${parts[1]}`;
      }
    }
  } else if (!src.startsWith('http') && !src.startsWith('data:') && imageKitUrl) {
      const path = src.startsWith('/') ? src : `/${src}`;
      finalSrc = transformation ? `${imageKitUrl}/${transformation}${path}` : `${imageKitUrl}${path}`;
      blurSrc = blurPlaceholder ? `${imageKitUrl}/tr:bl-10,q-20${path}` : '';
  } else if (blurPlaceholder && src.startsWith('http')) {
      // Just fallback to normal src if it's an external HTTP link and not imagekit
      blurSrc = src;
  }

  return (
    <div className={cn("relative overflow-hidden bg-zinc-800/50", className)}>
      {/* Blur placeholder */}
      {blurPlaceholder && blurSrc && (
        <img
          src={blurSrc}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-0" : "opacity-100 blur-md scale-110"
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          (!isLoaded && blurPlaceholder) ? "opacity-0" : "opacity-100"
        )}
        {...props}
      />
    </div>
  );
};
