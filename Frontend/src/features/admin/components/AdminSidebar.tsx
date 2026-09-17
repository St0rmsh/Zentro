import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Flag, 
  Tags, 
  Settings, 
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAppDispatch } from "@/shared/hooks";
import { logoutThunk } from "@/features/auth/state/authThunks";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/shared/components/Logo";
import { Button } from "@/shared/ui/button";

const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Posts", href: "/admin/posts", icon: FileText },
  { label: "Comments", href: "/admin/comments", icon: MessageSquare },
  { label: "Reports", href: "/admin/reports", icon: Flag },
  { label: "Categories & Tags", href: "/admin/categories", icon: Tags },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const AdminSidebar = () => {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 260 : 80 }}
      className="hidden md:flex flex-col sticky top-0 h-screen border-r border-border/50 bg-card z-30 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 mt-4 mb-2">
        <div className="flex items-center w-full">
          {isExpanded ? (
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-bold text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider ml-1 mt-1">Admin</span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl leading-none shadow-sm">
                A
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center rounded-xl px-3 py-3 transition-all group ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              } ${!isExpanded ? "justify-center" : ""}`
            }
            title={!isExpanded ? item.label : undefined}
          >
            <item.icon className={`h-5 w-5 flex-shrink-0 ${isExpanded ? "mr-3" : ""}`} />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 space-y-2 border-t border-border/50">
        <div className="flex justify-center mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full bg-muted/50 hover:bg-muted"
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <button
          onClick={() => dispatch(logoutThunk())}
          className={`flex items-center w-full rounded-xl px-3 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ${
            !isExpanded ? "justify-center" : ""
          }`}
          title={!isExpanded ? "Logout" : undefined}
        >
          <LogOut className={`h-5 w-5 flex-shrink-0 ${isExpanded ? "mr-3" : ""}`} />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap text-sm font-medium"
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
