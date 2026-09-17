import { Switch } from "@/shared/ui/switch";

interface PreferenceToggleProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const PreferenceToggle = ({ id, title, description, checked, onCheckedChange }: PreferenceToggleProps) => {
  return (
    <div className="flex items-start justify-between py-4">
      <div className="pr-4">
        <label htmlFor={id} className="font-medium text-foreground cursor-pointer select-none">
          {title}
        </label>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0 pt-1">
        <Switch 
          id={id}
          checked={checked} 
          onCheckedChange={onCheckedChange} 
        />
      </div>
    </div>
  );
};
