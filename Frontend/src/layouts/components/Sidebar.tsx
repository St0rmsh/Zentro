import { NavLink } from "react-router-dom";
import { Home, Compass, Edit3, Bell, User, Settings, LogOut, ChevronLeft, ChevronRight, Bookmark, MessageCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { ROUTES } from "@/router/routes.config";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { logoutThunk } from "@/features/auth/state/authThunks";
import { Logo } from "@/shared/components/Logo";
import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  if (!user) return null;

  const navItems = [
    { icon: Home, label: "Home", href: ROUTES.HOME },
    { icon: Compass, label: "Explore", href: ROUTES.EXPLORE },
    { icon: Bookmark, label: "Bookmarks", href: ROUTES.BOOKMARKS },
    { icon: Bell, label: "Notifications", href: ROUTES.NOTIFICATIONS },
    { icon: MessageCircle, label: "Messages", href: ROUTES.MESSAGES },
    { icon: Edit3, label: "Write", href: ROUTES.POSTS + "/new" },
    { icon: User, label: "Profile", href: ROUTES.PROFILE.replace(":username", user.username) },
    { icon: Settings, label: "Settings", href: ROUTES.SETTINGS },
  ];

  const sidebarVariants = {
    expanded: { width: "260px" },
    collapsed: { width: "80px" },
  };

  return (
    <motion.aside
      initial={sidebarOpen ? "expanded" : "collapsed"}
      animate={sidebarOpen ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      className="hidden md:flex flex-col sticky top-0 h-screen border-r border-border bg-background z-30 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 mt-4">
        <div className="flex items-center w-full">
          <Logo className={sidebarOpen ? "" : "hidden"} />
          {!sidebarOpen && (
            <div className="w-full flex justify-center">
               <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl leading-none shadow-sm">
                  Z
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center rounded-xl px-3 py-3 transition-colors group ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              } ${!sidebarOpen ? "justify-center" : ""}`
            }
            title={!sidebarOpen ? item.label : undefined}
          >
            <item.icon className={`h-5 w-5 flex-shrink-0 ${sidebarOpen ? "mr-4" : ""}`} />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap text-[15px]"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 space-y-4 mb-2">
        <div className={`flex items-center ${sidebarOpen ? "justify-between px-2" : "justify-center flex-col gap-4"}`}>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            className="rounded-full bg-muted/50 hover:bg-muted"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        
        <button
          onClick={() => dispatch(logoutThunk())}
          className={`flex items-center w-full rounded-xl px-3 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ${
            !sidebarOpen ? "justify-center" : ""
          }`}
          title={!sidebarOpen ? "Logout" : undefined}
        >
          <LogOut className={`h-5 w-5 flex-shrink-0 ${sidebarOpen ? "mr-4" : ""}`} />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap text-[15px]"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};
