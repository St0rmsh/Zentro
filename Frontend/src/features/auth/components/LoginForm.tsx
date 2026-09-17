import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { loginSchema, LoginFormData } from "../schemas/login.schema";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/shared/constants/routes";
import { AUTH_MESSAGES } from "../constants/authMessages";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "./PasswordInput";
import { SocialButton } from "./SocialButton";
import { API_BASE_URL } from "@/App/config/env";

export const LoginForm = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const oauthStatus = searchParams.get("oauth");
    if (oauthStatus === "failed") toast.error("Google or GitHub sign-in could not be completed.");
    if (oauthStatus === "unavailable") toast.error("That sign-in method is not configured yet.");
  }, [searchParams]);

  const {register,handleSubmit,formState: { errors },} = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      navigate(ROUTES.HOME);
    } catch (error) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      toast.error(error as string);
    }
  };

  return (
    <motion.div
      animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        {/* Email Field */}
        <div className="relative">
          <Input
            id="email"
            type="email"
            autoFocus
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

        {/* Password Field */}
        <div className="relative">
          <PasswordInput
            id="password"
            label="Password"
            placeholder=" "
            className="pt-5 pb-2 peer"
            {...register("password")}
          />
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
        </div>

        {/* Forgot Password */}
        <div className="flex items-center justify-end">
          <Link 
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
        </Button>
      </form>

      {/* Divider */}
      <div className="mt-6 flex items-center gap-4">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider shrink-0">Or continue with</span>
        <div className="h-px bg-border flex-1" />
      </div>

      {/* Social Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <SocialButton
          provider="Google"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
            </svg>
          }
          onClick={() => { window.location.href = `${API_BASE_URL}/auth/google`; }}
        />
        <SocialButton
          provider="GitHub"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.81 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C5.67 21.3 4.965 18.96 4.965 18.96C4.425 17.58 3.63 17.205 3.63 17.205C2.535 16.455 3.72 16.47 3.72 16.47C4.935 16.56 5.565 17.715 5.565 17.715C6.645 19.56 8.385 19.035 9.075 18.72C9.18 17.94 9.495 17.415 9.84 17.115C7.17 16.815 4.365 15.78 4.365 11.205C4.365 9.9 4.83 8.835 5.595 7.98C5.475 7.68 5.055 6.465 5.715 4.845C5.715 4.845 6.72 4.53 9.03 6.09C9.99 5.82 11.01 5.685 12.03 5.685C13.05 5.685 14.07 5.82 15.03 6.09C17.34 4.515 18.345 4.845 18.345 4.845C19.005 6.465 18.585 7.68 18.465 7.98C19.23 8.835 19.695 9.9 19.695 11.205C19.695 15.795 16.875 16.8 14.19 17.1C14.625 17.475 15.015 18.21 15.015 19.335C15.015 20.955 15 22.245 15 22.815C15 23.145 15.225 23.505 15.825 23.385C20.565 21.81 24 17.31 24 12C24 5.37 18.63 0 12 0Z" />
            </svg>
          }
          onClick={() => { window.location.href = `${API_BASE_URL}/auth/github`; }}
        />
      </div>
    </motion.div>
  );
};
