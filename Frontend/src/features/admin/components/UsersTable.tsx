import { AdminUser } from "../types";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, ShieldAlert, ShieldCheck, UserX, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface UsersTableProps {
  users: AdminUser[];
  onUpdateStatus: (id: string, status: AdminUser["status"]) => void;
  onUpdateRole: (id: string, role: AdminUser["role"]) => void;
}

export const UsersTable = ({ users, onUpdateStatus, onUpdateRole }: UsersTableProps) => {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.username}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' :
                    user.status === 'SUSPENDED' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(user.joinedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.status === 'ACTIVE' ? (
                        <DropdownMenuItem onClick={() => onUpdateStatus(user.id, 'SUSPENDED')} className="text-amber-500">
                          <UserX className="h-4 w-4 mr-2" /> Suspend User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onUpdateStatus(user.id, 'ACTIVE')} className="text-emerald-500">
                          <UserCheck className="h-4 w-4 mr-2" /> Activate User
                        </DropdownMenuItem>
                      )}
                      {user.role !== 'ADMIN' ? (
                        <DropdownMenuItem onClick={() => onUpdateRole(user.id, 'ADMIN')}>
                          <ShieldCheck className="h-4 w-4 mr-2" /> Make Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onUpdateRole(user.id, 'USER')}>
                          <ShieldAlert className="h-4 w-4 mr-2" /> Remove Admin
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
