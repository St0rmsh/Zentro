import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { logoutThunk } from "@/features/auth/state/authThunks";
import { ROUTES } from "@/router/routes.config";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { User, Settings, LogOut, Key } from "lucide-react";

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const profileUrl = ROUTES.PROFILE.replace(":username", user.username);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-1 p-0">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user?.avatar || ""} alt={user.username} />
            <AvatarFallback>{user.fullname?.charAt(0) || user.username?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullname}</p>
            <p className="text-xs leading-none text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={profileUrl}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={ROUTES.PROFILE_SETTINGS}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={ROUTES.CHANGE_PASSWORD}>
              <Key className="mr-2 h-4 w-4" />
              <span>Change Password</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => dispatch(logoutThunk())} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
