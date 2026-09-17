import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/shared/hooks";
import { ROUTES } from "./routes.config";

export const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Must be an admin to access these routes
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
