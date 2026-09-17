import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordSchema, ResetPasswordFormData } from "../schemas/resetPassword.schema";
import { authService } from "../services/auth.service";
import { AUTH_MESSAGES } from "../constants/authMessages";
import { ROUTES } from "@/shared/constants/routes";
import { handleApiError as handleAuthError } from "@/shared/utils/errorHandler";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl,
    },
  });

  const password = watch("newPassword");

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      await authService.resetPassword(data);
      toast.success(AUTH_MESSAGES.RESET_PASSWORD_SUCCESS);
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error(handleAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      {/* Email Field (disabled) */}
      <div className="relative">
        <Input
          id="email"
          type="email"
          placeholder=" "
          className="pt-5 pb-2 peer bg-muted"
          disabled
          {...register("email")}
        />
        <Label 
          htmlFor="email"
          className="absolute left-3 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary pointer-events-none"
        >
          Email address
        </Label>
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>

      {/* OTP Field */}
      <div className="relative">
        <Input
          id="otp"
          placeholder=" "
          maxLength={6}
          className="pt-5 pb-2 peer tracking-widest"
          {...register("otp")}
        />
        <Label 
          htmlFor="otp"
          className="absolute left-3 top-1.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary pointer-events-none"
        >
          6-Digit OTP
        </Label>
        {errors.otp && <p className="mt-1 text-xs text-destructive">{errors.otp.message}</p>}
      </div>

      {/* New Password Field */}
      <div>
        <div className="relative">
          <PasswordInput
            id="newPassword"
            label="New Password"
            placeholder=" "
            className="pt-5 pb-2 peer"
            {...register("newPassword")}
          />
        </div>
        <PasswordStrengthMeter password={password} />
        {errors.newPassword && <p className="mt-1 text-xs text-destructive">{errors.newPassword.message}</p>}
      </div>

      {/* Confirm Password Field */}
      <div className="relative">
        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          placeholder=" "
          className="pt-5 pb-2 peer"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full !mt-6" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
      </Button>
    </form>
  );
};
