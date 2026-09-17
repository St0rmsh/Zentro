import { Outlet, Link } from "react-router-dom";
import { ROUTES } from "@/router/routes.config";

/**
 * Error Layout Component
 * Layout for error pages (401, 403, 404, 500, etc.)
 */
export const ErrorLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <Outlet />
        
        {/* Default Error Navigation */}
        <div className="flex gap-4 justify-center">
          <Link
            to={ROUTES.HOME}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
