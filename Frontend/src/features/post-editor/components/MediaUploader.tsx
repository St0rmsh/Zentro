import { Play, Plus, Trash2, UploadCloud } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { uploadService } from "../services/upload.service";

interface MediaUploaderProps {
  value: File[];
  onChange: (value: File[]) => void;
}

export default function MediaUploader({ value, onChange }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const previews = useMemo(
    () =>
      value.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        isVideo: file.type.startsWith("video/"),
      })),
    [value]
  );

  const addFiles = (files: File[]) => {
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
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length) addFiles(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files || []);
    if (files.length) addFiles(files);
  };

  const removeMedia = (index: number) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {previews.map(({ file, url, isVideo }, index) => (
          <div
            key={`${file.name}-${file.lastModified}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
          >
            {isVideo ? (
              <>
                <video src={url} className="h-full w-full object-cover" muted />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
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

            <div className="absolute inset-0 flex items-end justify-end bg-black/0 p-1.5 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => removeMedia(index)}
                aria-label={`Remove ${file.name}`}
                className="
                  inline-flex h-7 w-7 items-center justify-center rounded-full
                  bg-white/90 text-destructive transition-colors hover:bg-white
                "
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
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
            <UploadCloud size={20} className="text-muted-foreground" />
          ) : (
            <Plus
              size={20}
              className="text-muted-foreground transition-colors group-hover:text-foreground"
            />
          )}

          <span className="mt-1 text-[11px] font-medium text-muted-foreground">
            Add media
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
        Images or videos up to 50MB each.
      </p>
    </div>
  );
}