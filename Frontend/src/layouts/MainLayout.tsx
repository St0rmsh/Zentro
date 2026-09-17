import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { RightSidebar } from "./components/RightSidebar";
import { TopNavigation } from "./components/TopNavigation";
import { BottomNavigation } from "./components/BottomNavigation";

/**
 * Main Layout Component
 * Layout for main application pages (feed, explore, posts, profile, etc.)
 */
export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground w-full max-w-screen-2xl mx-auto xl:px-4">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopNavigation />

        {/* Main Content */}
        <main className="flex-1 w-full pb-16 md:pb-0">
          <div className="mx-auto w-full min-h-screen border-x border-border/40 bg-background relative flex justify-center">
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </main>
        
        <BottomNavigation />
      </div>

      <RightSidebar />
    </div>
  );
};
