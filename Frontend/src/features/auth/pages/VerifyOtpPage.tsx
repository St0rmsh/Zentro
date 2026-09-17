import { AuthLayout } from "../components/AuthLayout";
import { AuthCard } from "../components/AuthCard";
import { VerifyOtpForm } from "../components/VerifyOtpForm";

export const VerifyOtpPage = () => {
  return (
    <AuthLayout>
      <AuthCard
        title="Verify your email"
        description="We've sent a 6-digit code to your email. Enter it below to confirm your account."
      >
        <VerifyOtpForm />
      </AuthCard>
    </AuthLayout>
  );
};
