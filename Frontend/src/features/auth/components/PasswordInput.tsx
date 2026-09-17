import { useState, KeyboardEvent } from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import React from "react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, onKeyDown, onKeyUp, label, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false);

    const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
      setCapsLockActive(e.getModifierState("CapsLock"));
    };

    return (
      <div className="relative w-full">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          className={`pr-16 ${className}`}
          ref={ref}
          onKeyDown={(e) => {
            handleKeyEvent(e);
            if (onKeyDown) onKeyDown(e);
          }}
          onKeyUp={(e) => {
            handleKeyEvent(e);
            if (onKeyUp) onKeyUp(e);
          }}
          {...props}
        />
        {label && (
          <Label 
            htmlFor={id}
            className="absolute left-3 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary pointer-events-none"
          >
            {label}
          </Label>
        )}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {capsLockActive && (
            <span title="Caps Lock is ON" className="flex items-center">
              <AlertTriangle 
                size={16} 
                className="text-warning text-yellow-500 animate-pulse" 
              />
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
