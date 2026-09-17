import {
  FileImage,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import { useRef } from "react";
import { uploadService } from "../services/upload.service";

interface MediaUploaderProps {
  value: File[];
  onChange: (value: File[]) => void;
}

export default function MediaUploader({
  value,
  onChange,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const validFiles: File[] = [];

    for (const file of files) {
      const validation = uploadService.validateMedia(file);

      if (validation) {
        alert(`${file.name}\n\n${validation}`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onChange([...value, ...validFiles]);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeMedia = (index: number) => {
    onChange(
      value.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="
          group flex w-full flex-col items-center justify-center
          rounded-xl border-2 border-dashed border-border
          bg-muted/30 px-6 py-10 text-center
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
            mb-3 flex h-11 w-11 items-center justify-center
            rounded-lg border border-border
            bg-background
            text-muted-foreground
            transition-colors
            group-hover:text-foreground
          "
        >
          <UploadCloud size={21} />
        </div>

        <p className="text-sm font-semibold text-foreground">
          Add media
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Images or videos up to 50MB each
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFiles}
      />

      {/* Files */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="
                flex items-center justify-between
                rounded-lg border border-border
                bg-background p-3
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-lg bg-muted
                    text-muted-foreground
                  "
                >
                  {file.type.startsWith("video/") ? (
                    <Video size={18} />
                  ) : (
                    <FileImage size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="
                  ml-3 inline-flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-md
                  text-muted-foreground
                  transition-colors
                  hover:bg-destructive/10
                  hover:text-destructive
                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring
                "
                aria-label={`Remove ${file.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}