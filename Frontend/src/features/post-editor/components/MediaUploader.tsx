import { Film, Play, Plus, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { uploadService } from "../services/upload.service";

interface MediaUploaderProps {
  value: File[];
  onChange: (value: File[]) => void;
}

type Preview = {
  file: File;
  url: string;
  isVideo: boolean;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

export default function MediaUploader({ value, onChange }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<Preview[]>([]);

  /* ---------- Preview URLs (created per change, always revoked) ---------- */
  useEffect(() => {
    const next: Preview[] = value.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith("video/"),
    }));

    setPreviews(next);

    return () => {
      next.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [value]);

  /* ---------- Adding files ---------- */
  const addFiles = (files: File[]) => {
    const existing = new Set(value.map(fileKey));
    const validFiles: File[] = [];
    let duplicates = 0;

    for (const file of files) {
      if (
        !file.type.startsWith("image/") &&
        !file.type.startsWith("video/")
      ) {
        toast.error(`${file.name}: only images and videos are allowed.`);
        continue;
      }

      const validation = uploadService.validateMedia(file);

      if (validation) {
        toast.error(`${file.name}: ${validation}`);
        continue;
      }

      const key = fileKey(file);

      if (existing.has(key)) {
        duplicates += 1;
        continue;
      }

      existing.add(key);
      validFiles.push(file);
    }

    if (duplicates > 0) {
      toast(
        duplicates === 1
          ? "1 file was already added."
          : `${duplicates} files were already added.`
      );
    }

    if (validFiles.length > 0) {
      onChange([...value, ...validFiles]);
    }
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length) addFiles(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ---------- Drag and drop (works anywhere on the uploader) ---------- */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files || []);
    if (files.length) addFiles(files);
  };

  /* ---------- Removing files ---------- */
  const removeMedia = (index: number) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  const clearAll = () => onChange([]);

  const openPicker = () => inputRef.current?.click();

  const totalSize = value.reduce((sum, file) => sum + file.size, 0);

  return (
    <div
      className="space-y-3"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Summary row */}
      {value.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="tabular-nums">
            {value.length} {value.length === 1 ? "file" : "files"} ·{" "}
            {formatSize(totalSize)}
          </span>

          <button
            type="button"
            onClick={clearAll}
            className="
              rounded-md px-2 py-1 font-medium transition-colors
              hover:bg-muted hover:text-destructive
              focus:outline-none focus:ring-2 focus:ring-ring
            "
          >
            Remove all
          </button>
        </div>
      )}

      <div
        className={`
          grid grid-cols-3 gap-2 rounded-xl sm:grid-cols-4
          ${isDragging ? "bg-muted/40 ring-2 ring-foreground/30 ring-offset-4 ring-offset-background" : ""}
          transition-all
        `}
      >
        {previews.map(({ file, url, isVideo }, index) => (
          <div
            key={`${fileKey(file)}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
          >
            {isVideo ? (
              <>
                <video
                  src={url}
                  preload="metadata"
                  className="h-full w-full object-cover"
                  muted
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play size={22} className="fill-white text-white" />
                </div>
              </>
            ) : (
              <img
                src={url}
                alt={file.name}
                className="h-full w-full object-cover"
              />
            )}

            {/* Type badge */}
            <span
              className="
                pointer-events-none absolute left-1.5 top-1.5 inline-flex items-center
                gap-1 rounded-full bg-black/60 px-1.5 py-0.5
                text-[10px] font-medium text-white
              "
            >
              {isVideo && <Film size={10} />}
              {formatSize(file.size)}
            </span>

            {/* Remove: always visible on touch, on hover/focus for desktop */}
            <div
              className="
                absolute inset-0 flex items-end justify-end bg-black/0 p-1.5
                opacity-100 transition-all
                sm:opacity-0 sm:group-hover:bg-black/30 sm:group-hover:opacity-100
                sm:group-focus-within:bg-black/30 sm:group-focus-within:opacity-100
              "
            >
              <button
                type="button"
                onClick={() => removeMedia(index)}
                aria-label={`Remove ${file.name}`}
                className="
                  inline-flex h-7 w-7 items-center justify-center rounded-full
                  bg-white/90 text-destructive transition-colors hover:bg-white
                  focus:outline-none focus:ring-2 focus:ring-ring
                "
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {/* Add tile */}
        <button
          type="button"
          onClick={openPicker}
          className={`
            group flex aspect-square flex-col items-center justify-center
            rounded-lg border-2 border-dashed text-center transition-colors
            focus:outline-none focus:ring-2 focus:ring-ring
            ${
              isDragging
                ? "border-foreground/50 bg-muted/60"
                : "border-border bg-muted/30 hover:border-foreground/30 hover:bg-muted/50"
            }
          `}
        >
          {isDragging ? (
            <UploadCloud size={20} className="animate-pulse text-muted-foreground" />
          ) : (
            <Plus
              size={20}
              className="text-muted-foreground transition-colors group-hover:text-foreground"
            />
          )}

          <span className="mt-1 text-[11px] font-medium text-muted-foreground">
            {isDragging ? "Drop here" : "Add media"}
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFiles}
      />

      <p className="text-xs text-muted-foreground">
        Drag and drop or click to add. Images or videos up to 50MB each.
      </p>
    </div>
  );
}