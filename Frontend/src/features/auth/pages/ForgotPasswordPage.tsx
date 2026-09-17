import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { AuthCard } from "../components/AuthCard";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { ROUTES } from "@/shared/constants/routes";

export const ForgotPasswordPage = () => {
  return (
    <AuthLayout>
      <AuthCard
        title="Forgot Password"
        description="Enter your email to receive a password reset link."
        footer={
          <span>
            Remember your password?{" "}
            <Link to={ROUTES.LOGIN} className="text-accent hover:underline">
              Sign in
            </Link>
          </span>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
};
