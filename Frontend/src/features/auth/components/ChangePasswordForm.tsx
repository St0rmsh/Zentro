import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changePasswordSchema, ChangePasswordFormData } from "../schemas/changePassword.schema";
import { authService } from "../services/auth.service";
import { AUTH_MESSAGES } from "../constants/authMessages";
import { ROUTES } from "@/shared/constants/routes";
import { handleApiError as handleAuthError } from "@/shared/utils/errorHandler";

import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export const ChangePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const password = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setLoading(true);
      await authService.changePassword(data);
      toast.success(AUTH_MESSAGES.CHANGE_PASSWORD_SUCCESS);
      navigate(ROUTES.PROFILE_SETTINGS);
    } catch (error) {
      toast.error(handleAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
      <div className="space-y-2 relative">
        <Label htmlFor="oldPassword">Current Password</Label>
        <PasswordInput
          id="oldPassword"
          {...register("oldPassword")}
        />
        {errors.oldPassword && <p className="text-xs text-destructive">{errors.oldPassword.message}</p>}
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="newPassword">New Password</Label>
        <PasswordInput
          id="newPassword"
          {...register("newPassword")}
        />
        <PasswordStrengthMeter password={password} />
        {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <PasswordInput
          id="confirmPassword"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
      </Button>
    </form>
  );
};
