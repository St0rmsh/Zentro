import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { useAppSelector } from "@/shared/hooks";

export const AdminLayout = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Fallback check just in case AdminRoute fails or isn't used
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Allow SUPER_ADMIN and ADMIN
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground w-full">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <AdminNavbar />
        <main className="flex-1 w-full p-4 md:p-8 bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
