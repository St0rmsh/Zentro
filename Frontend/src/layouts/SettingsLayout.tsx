import { Outlet, Link, useLocation } from "react-router-dom";
import { User, Shield, Eye, Settings as SettingsIcon, CreditCard, Palette, Info, HelpCircle } from "lucide-react";
import { ROUTES } from "@/router/routes.config";
import { Sidebar } from "./components/Sidebar";
import { TopNavigation } from "./components/TopNavigation";
import { BottomNavigation } from "./components/BottomNavigation";

const SETTINGS_SECTIONS = [
  { name: "Account", href: ROUTES.ACCOUNT_SETTINGS, icon: CreditCard },
  { name: "Profile", href: ROUTES.PROFILE_SETTINGS, icon: User },
  { name: "Security", href: ROUTES.SECURITY_SETTINGS, icon: Shield },
  { name: "Appearance", href: ROUTES.APPEARANCE_SETTINGS, icon: Palette },
  { name: "Privacy", href: ROUTES.PRIVACY_SETTINGS, icon: Eye },
  { name: "Preferences", href: ROUTES.PREFERENCES_SETTINGS, icon: SettingsIcon },
  { name: "About", href: ROUTES.ABOUT_SETTINGS, icon: Info },
  { name: "Help", href: ROUTES.HELP_SETTINGS, icon: HelpCircle },
];

/**
 * Settings Layout Component
 * Layout for settings pages with sidebar navigation
 */
export const SettingsLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground w-full max-w-[1400px] mx-auto">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopNavigation />

        <div className="flex flex-1 w-full pb-16 md:pb-0 relative">
          {/* Settings Sidebar */}
          <aside className="hidden md:block w-64 border-x border-border/40 bg-background h-screen sticky top-0 px-4 py-6">
            <h2 className="text-xl font-bold mb-6 tracking-tight">Settings</h2>
            <nav className="space-y-1">
              {SETTINGS_SECTIONS.map((section) => (
                <Link
                  key={section.href}
                  to={section.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                    location.pathname === section.href
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  <span>{section.name}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Settings Content */}
          <main className="flex-1 max-w-2xl w-full p-4 md:p-8">
            <Outlet />
          </main>
        </div>
        
        <BottomNavigation />
      </div>
    </div>
  );
};
