import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/shared/hooks";
import { ROUTES } from "./routes.config";
import { PageLoader } from "@/shared/components/PageLoader";

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Guest Route Component
 * Only allows non-authenticated users to access the route
 * Redirects to home if user is already authenticated
 */
export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated, hydrationCompleted } = useAppSelector((state) => state.auth);

  if (!hydrationCompleted) {
    return <PageLoader />;
  }

  // Already authenticated - redirect to home
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};
