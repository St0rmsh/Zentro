import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "../components/LoginForm";
import { ROUTES } from "@/shared/constants/routes";

export const LoginPage = () => {
  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Enter your credentials to access your account."
        footer={
          <span>
            Don't have an account?{" "}
            <Link to={ROUTES.REGISTER} className="text-accent hover:underline">
              Sign up
            </Link>
          </span>
        }
      >
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
};
