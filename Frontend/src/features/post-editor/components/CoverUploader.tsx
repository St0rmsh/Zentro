import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { uploadService } from "../services/upload.service";

interface CoverUploaderProps {
  value: string | File | null;
  onChange: (value: File | null | string) => void;
}

export default function CoverUploader({ value, onChange }: CoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const previewUrl =
    typeof value === "string"
      ? value
      : value instanceof File
      ? URL.createObjectURL(value)
      : "";

  const processFile = (file: File) => {
    const validation = uploadService.validateImage(file);

    if (validation) {
      alert(validation);
      return;
    }

    setUploading(true);
    onChange(file);
    setUploading(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const removeCover = () => {
    onChange("");
  };

  return (
    <div>
      {previewUrl ? (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={previewUrl}
            alt="Post cover preview"
            className="aspect-[16/7] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="
                inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5
                text-xs font-semibold text-foreground transition-colors hover:bg-white
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
              "
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center p-4 pt-10">
            <span className="text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              Cover preview
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
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
            {uploading ? (
              <UploadCloud size={22} className="animate-pulse" />
            ) : (
              <ImagePlus size={22} />
            )}
          </div>

          <p className="text-sm font-semibold text-foreground">
            {uploading
              ? "Preparing image..."
              : isDragging
              ? "Drop to upload"
              : "Upload cover image"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Drag and drop, or click to browse — PNG, JPG, WEBP up to 5MB
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