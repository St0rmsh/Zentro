import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ length = 6, value, onChange, disabled }: OtpInputProps) {
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^[0-9]*$/.test(val)) return;

    const newValue = value.split("");
    newValue[index] = val.slice(-1);
    const finalValue = newValue.join("");
    onChange(finalValue);

    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length).replace(/[^0-9]/g, "");
    if (pastedData) {
      onChange(pastedData);
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className={cn(
            "w-10 h-12 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors",
            "bg-background text-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
