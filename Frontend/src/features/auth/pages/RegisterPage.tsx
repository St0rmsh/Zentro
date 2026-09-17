import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { AuthCard } from "../components/AuthCard";
import { RegisterForm } from "../components/RegisterForm";
import { ROUTES } from "@/shared/constants/routes";

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <AuthCard
        title="Create an account"
        description="Join Zentro to start sharing your voice."
        footer={
          <span>
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="text-accent hover:underline">
              Sign in
            </Link>
          </span>
        }
      >
        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  );
};
