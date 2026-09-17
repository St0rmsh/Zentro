import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/shared/hooks";
import { ROUTES } from "./routes.config";
import { PageLoader } from "@/shared/components/PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
}

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Redirects to unauthorized if user lacks required permissions
 * Shows loader while initial auth check is in progress
 */
export const ProtectedRoute = ({
  children,
  requiresAdmin = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, hydrationCompleted } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  // Wait for hydration to complete
  if (!hydrationCompleted) {
    return <PageLoader />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Requires admin but user is not admin
  if (requiresAdmin && !isAdmin) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <>{children}</>;
};
