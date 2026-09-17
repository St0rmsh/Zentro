import { FileText } from "lucide-react";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TitleInput({
  value,
  onChange,
}: TitleInputProps) {
  return (
    <div>
      <label
        htmlFor="post-title"
        className="
          mb-3 flex items-center gap-2
          text-sm font-semibold
          text-foreground
        "
      >
        <FileText size={16} />
        Post Title
      </label>

      <input
        id="post-title"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter a compelling title..."
        className="
          w-full
          border-0
          bg-transparent
          text-2xl
          font-bold
          text-foreground
          outline-none
          placeholder:text-muted-foreground
          focus:ring-0
          sm:text-3xl
        "
      />

      <p className="mt-3 text-xs text-muted-foreground">
        Keep your title clear, specific, and easy to understand.
      </p>
    </div>
  );
}