import { Switch } from "@/shared/ui/switch";

interface PreferenceToggleProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const PreferenceToggle = ({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: PreferenceToggleProps) => {
  return (
    <div className="flex items-start justify-between py-4">
      <div className="pr-4">
        <label
          htmlFor={id}
          className="cursor-pointer select-none font-medium text-foreground"
        >
          {title}
        </label>

        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex-shrink-0 pt-1">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};