import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { useCapsLock } from "@/shared/hooks/useCapsLock";
import { cn } from "@/shared/lib/utils";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isCapsLockOn = useCapsLock();

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-16", className)}
          ref={ref}
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isCapsLockOn && (
            <span className="text-[10px] font-medium text-destructive bg-destructive/10 px-1 rounded">
              CAPS
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
