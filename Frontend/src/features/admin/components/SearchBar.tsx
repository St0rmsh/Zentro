import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchBar = ({ placeholder = "Search...", value, onChange, className = "" }: SearchBarProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/20"
      />
    </div>
  );
};
