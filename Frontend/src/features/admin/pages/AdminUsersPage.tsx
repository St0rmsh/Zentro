import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure, updateUserStatus, updateUserRole } from "../state/adminUsersSlice";
import { usersService } from "../services/users.service";
import { UsersTable } from "../components/UsersTable";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { AdminLoader } from "../components/AdminLoader";
import { AdminUser } from "../types";

export const AdminUsersPage = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, total } = useAppSelector((state) => state.adminUsers);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  useEffect(() => {
    const loadUsers = async () => {
      dispatch(fetchUsersStart());
      try {
        const data = await usersService.getUsers(page, limit);
        dispatch(fetchUsersSuccess(data));
      } catch (err: any) {
        dispatch(fetchUsersFailure(err.message));
      }
    };
    loadUsers();
  }, [dispatch, page]);

  const handleUpdateStatus = async (id: string, status: AdminUser['status']) => {
    await usersService.updateStatus(id, status);
    dispatch(updateUserStatus({ id, status }));
  };

  const handleUpdateRole = async (id: string, role: AdminUser['role']) => {
    await usersService.updateRole(id, role);
    dispatch(updateUserRole({ id, role }));
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground mt-2">Manage all registered users, their roles, and status.</p>
        </div>
        <div className="w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search users..." className="w-full sm:w-64" />
        </div>
      </div>

      {isLoading ? (
        <AdminLoader />
      ) : (
        <div className="space-y-4">
          <UsersTable 
            users={filteredUsers} 
            onUpdateStatus={handleUpdateStatus} 
            onUpdateRole={handleUpdateRole} 
          />
          <Pagination 
            currentPage={page} 
            totalPages={Math.ceil(total / limit)} 
            onPageChange={setPage} 
          />
        </div>
      )}
    </motion.div>
  );
};
