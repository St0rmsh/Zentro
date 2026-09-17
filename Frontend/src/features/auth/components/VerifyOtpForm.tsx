import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/auth.service";
import { AUTH_MESSAGES } from "../constants/authMessages";
import { ROUTES } from "@/shared/constants/routes";
import { handleApiError as handleAuthError } from "@/shared/utils/errorHandler";

import { Button } from "@/shared/ui/button";

export const VerifyOtpForm = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || undefined;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if there's a value
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6).split("");
    if (pastedData.some(char => isNaN(Number(char)))) return;

    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    // Focus last filled input
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      await authService.verifyOtp(otpValue, email);
      toast.success(AUTH_MESSAGES.VERIFY_OTP_SUCCESS);
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(handleAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await authService.sendOtp(email);
      toast.success(AUTH_MESSAGES.SEND_OTP_SUCCESS);
      setTimer(60);
    } catch (error) {
      toast.error(handleAuthError(error));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* OTP Input Grid */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => { inputRefs.current[index] = el; }}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border border-input bg-transparent shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
          />
        ))}
      </div>

      <Button 
        onClick={handleVerify} 
        className="w-full" 
        disabled={loading || otp.join("").length !== 6}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify OTP"}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0 || resending}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {resending ? (
            <span className="flex items-center justify-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Sending...</span>
          ) : timer > 0 ? (
            `Resend OTP in ${timer}s`
          ) : (
            "Didn't receive code? Resend OTP"
          )}
        </button>
      </div>
    </div>
  );
};
