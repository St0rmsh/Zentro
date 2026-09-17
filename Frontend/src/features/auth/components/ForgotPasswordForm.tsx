import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { forgotPasswordSchema, ForgotPasswordFormData } from "../schemas/forgotPassword.schema";
import { authService } from "../services/auth.service";
import { AUTH_MESSAGES } from "../constants/authMessages";
import { handleApiError as handleAuthError } from "@/shared/utils/errorHandler";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      await authService.forgotPassword(data);
      setIsSent(true);
      toast.success(AUTH_MESSAGES.FORGOT_PASSWORD_SUCCESS);
    } catch (error) {
      toast.error(handleAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="bg-success/10 text-success p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-medium">Check your email</h3>
        <p className="text-muted-foreground text-sm">
          We've sent a password reset link to your email address.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
      <div className="relative">
        <Input
          id="email"
          type="email"
          placeholder=" "
          className="pt-5 pb-2 peer"
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
      </Button>
    </form>
  );
};
