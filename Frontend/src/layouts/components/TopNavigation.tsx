import { Search, Menu } from "lucide-react";
import { useAppDispatch } from "@/shared/hooks";
import { setGlobalSearchOpen, setMobileMenuOpen } from "@/store/slices/uiSlice";
import { Logo } from "@/shared/components/Logo";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { UserMenu } from "@/shared/components/UserMenu";
import { Button } from "@/shared/ui/button";
import { NotificationBell } from "@/features/notification/components/NotificationBell";

export const TopNavigation = () => {
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => dispatch(setMobileMenuOpen(true))}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <Logo className="md:hidden" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => dispatch(setGlobalSearchOpen(true))}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <NotificationBell />
          
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
