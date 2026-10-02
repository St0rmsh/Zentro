import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { uploadService } from "../services/upload.service";

interface CoverUploaderProps {
  value: string | File | null;
  onChange: (value: File | null | string) => void;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function CoverUploader({ value, onChange }: CoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  /* ---------- Preview URL (created once per file, always cleaned up) ---------- */
  useEffect(() => {
    setImageFailed(false);

    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setPreviewUrl(typeof value === "string" ? value : "");
  }, [value]);

  /* ---------- File handling ---------- */
  const processFile = (file: File) => {
    const validation = uploadService.validateImage(file);

    if (validation) {
      toast.error(validation);
      return;
    }

    onChange(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file.");
      return;
    }

    processFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    // Ignore dragleave events fired when moving over child elements
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setIsDragging(false);
  };

  const removeCover = () => {
    onChange("");
  };

  const openPicker = () => inputRef.current?.click();

  const showPreview = Boolean(previewUrl) && !imageFailed;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {showPreview ? (
        <div
          className={`
            group relative overflow-hidden rounded-xl border bg-muted transition-colors
            ${isDragging ? "border-foreground/50" : "border-border"}
          `}
        >
          <img
            src={previewUrl}
            alt="Post cover preview"
            onError={() => setImageFailed(true)}
            className="aspect-[16/7] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Gradient overlay */}
          <div
            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-t from-black/60 via-transparent to-transparent
              opacity-100 transition-opacity
              sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100
            "
          />

          {/* Actions: always visible on touch screens, on hover for desktop */}
          <div
            className="
              absolute right-3 top-3 flex gap-2
              opacity-100 transition-opacity
              sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100
            "
          >
            <button
              type="button"
              onClick={openPicker}
              className="
                inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5
                text-xs font-semibold text-foreground transition-colors hover:bg-white
                focus:outline-none focus:ring-2 focus:ring-ring
              "
            >
              <ImagePlus size={13} />
              Change
            </button>

            <button
              type="button"
              onClick={removeCover}
              className="
                inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5
                text-xs font-semibold text-destructive transition-colors hover:bg-white
                focus:outline-none focus:ring-2 focus:ring-ring
              "
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>

          {/* Caption */}
          <div
            className="
              pointer-events-none absolute inset-x-0 bottom-0 flex items-center
              justify-between gap-3 p-4 pt-10
              opacity-100 transition-opacity
              sm:opacity-0 sm:group-hover:opacity-100
            "
          >
            <span className="truncate text-xs font-medium text-white">
              {value instanceof File ? value.name : "Cover preview"}
            </span>

            {value instanceof File && (
              <span className="shrink-0 text-xs tabular-nums text-white/80">
                {formatSize(value.size)}
              </span>
            )}
          </div>

          {/* Drop-to-replace overlay */}
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground">
                Drop to replace cover
              </span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className={`
            group flex min-h-[190px] w-full flex-col items-center justify-center
            rounded-xl border-2 border-dashed px-6 text-center
            transition-colors focus:outline-none focus:ring-2 focus:ring-ring
            ${
              isDragging
                ? "border-foreground/50 bg-muted/60"
                : "border-border bg-muted/30 hover:border-foreground/30 hover:bg-muted/50"
            }
          `}
        >
          <div
            className="
              mb-4 flex h-12 w-12 items-center justify-center rounded-xl
              border border-border bg-background text-muted-foreground
              transition-colors group-hover:text-foreground
            "
          >
            {isDragging ? (
              <UploadCloud size={22} className="animate-pulse" />
            ) : (
              <ImagePlus size={22} />
            )}
          </div>

          <p className="text-sm font-semibold text-foreground">
            {imageFailed
              ? "Couldn't load this image. Upload a new one"
              : isDragging
              ? "Drop to upload"
              : "Upload cover image"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Drag and drop, or click to browse. PNG, JPG, WEBP up to 5MB
          </p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}