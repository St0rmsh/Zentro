import {
  ImagePlus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { uploadService } from "../services/upload.service";

interface CoverUploaderProps {
  value: string | File | null;
  onChange: (value: File | null | string) => void;
}

export default function CoverUploader({
  value,
  onChange,
}: CoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const previewUrl = typeof value === "string" 
    ? value 
    : value instanceof File 
      ? URL.createObjectURL(value) 
      : "";

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validation = uploadService.validateImage(file);

    if (validation) {
      alert(validation);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    try {
      setUploading(true);

      onChange(file);
    } catch (error) {
      console.error("Cover upload error:", error);

      alert("Failed to prepare cover image.");
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const removeCover = () => {
    onChange("");
  };

  return (
    <div>
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={previewUrl}
            alt="Post cover preview"
            className="aspect-[16/7] w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
            <span className="text-xs font-medium text-white">
              Cover preview
            </span>

            <button
              type="button"
              onClick={removeCover}
              className="
                inline-flex items-center gap-2
                rounded-md
                bg-white/90
                px-3 py-2
                text-xs font-semibold
                text-destructive
                transition-colors
                hover:bg-white
              "
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="
            group flex min-h-[190px] w-full
            flex-col items-center justify-center
            rounded-xl
            border-2 border-dashed border-border
            bg-muted/30
            px-6
            text-center
            transition-colors
            hover:border-foreground/30
            hover:bg-muted/50
            focus:outline-none
            focus:ring-2
            focus:ring-ring
          "
        >
          <div
            className="
              mb-4 flex h-12 w-12
              items-center justify-center
              rounded-xl
              border border-border
              bg-background
              text-muted-foreground
              transition-colors
              group-hover:text-foreground
            "
          >
            {uploading ? (
              <UploadCloud
                size={22}
                className="animate-pulse"
              />
            ) : (
              <ImagePlus size={22} />
            )}
          </div>

          <p className="text-sm font-semibold text-foreground">
            {uploading
              ? "Preparing image..."
              : "Upload cover image"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, WEBP up to 5MB
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