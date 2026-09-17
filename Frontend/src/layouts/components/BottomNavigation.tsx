import { NavLink } from "react-router-dom";
import { Home, Compass, Edit3, Bell, User } from "lucide-react";
import { ROUTES } from "@/router/routes.config";
import { useAppSelector } from "@/shared/hooks";

export const BottomNavigation = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const navItems = [
    { icon: Home, label: "Home", href: ROUTES.HOME },
    { icon: Compass, label: "Explore", href: ROUTES.EXPLORE },
    { icon: Edit3, label: "Write", href: ROUTES.POSTS + "/new" },
    { icon: Bell, label: "Notifications", href: ROUTES.NOTIFICATIONS },
    { icon: User, label: "Profile", href: ROUTES.PROFILE.replace(":username", user.username) },
  ];

  return (
    <nav className="fixed bottom-0 z-40 w-full border-t border-border bg-background/80 backdrop-blur-md md:hidden pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
