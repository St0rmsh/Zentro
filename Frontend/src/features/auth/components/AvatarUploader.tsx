import { useState, useRef } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  onFileSelect: (file: File) => void;
}

export const AvatarUploader = ({ currentAvatarUrl, onFileSelect }: AvatarUploaderProps) => {
  const [preview, setPreview] = useState<string | undefined>(currentAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return; // Basic validation
      onFileSelect(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative group cursor-pointer" 
        onClick={() => fileInputRef.current?.click()}
      >
        <Avatar className="w-24 h-24 border-2 border-border shadow-sm">
          <AvatarImage src={preview} />
          <AvatarFallback className="bg-muted">
            <ImageIcon className="text-muted-foreground w-8 h-8" />
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="text-white w-6 h-6" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="text-center">
        <p className="text-sm font-medium">Profile picture</p>
        <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 5MB.</p>
      </div>
    </div>
  );
};
