import { useAppSelector } from "@/shared/hooks";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { NotificationBell } from "@/features/notification/components/NotificationBell";
import { Link } from "react-router-dom";

export const AdminNavbar = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">Admin Portal</h1>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors mr-2">
            Back to App
          </Link>
          <ThemeToggle />
          <NotificationBell />
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-border/50">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-medium leading-none">{user.fullname || user.username}</span>
                <span className="text-xs text-muted-foreground mt-1 capitalize">{user.role?.toLowerCase() || 'Admin'}</span>
              </div>
              <img
                src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username}
                alt={user.username}
                className="w-9 h-9 rounded-full object-cover border border-border"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
