import { Outlet } from "react-router-dom";

/**
 * Auth Layout Component (Router-level)
 * Layout for authentication pages (login, register, reset password, etc.)
 * This is a pass-through layout — the actual auth page styling 
 * (hero + card split) is handled by the feature-level AuthLayout.
 */
export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};
