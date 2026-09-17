import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";

interface BannerUploaderProps {
  currentBannerUrl?: string;
  onFileSelect: (file: File) => void;
}

export const BannerUploader = ({ currentBannerUrl, onFileSelect }: BannerUploaderProps) => {
  const [preview, setPreview] = useState<string | undefined>(currentBannerUrl);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-2">
      <div
        className={`relative w-full h-48 rounded-xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Banner Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium text-sm flex items-center gap-2">
                <UploadCloud size={16} /> Change Banner
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-6 flex flex-col items-center">
            <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">Click or drag banner image here</p>
            <p className="text-xs text-muted-foreground">Optimal size 1500x500px</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
