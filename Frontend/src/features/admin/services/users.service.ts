import { AdminUser } from '../types';

// Mock data
const mockUsers: AdminUser[] = [
  { id: '1', username: 'johndoe', email: 'john@example.com', role: 'USER', status: 'ACTIVE', isVerified: true, joinedDate: '2023-01-15' },
  { id: '2', username: 'janedoe', email: 'jane@example.com', role: 'ADMIN', status: 'ACTIVE', isVerified: true, joinedDate: '2023-02-10' },
  { id: '3', username: 'spammer', email: 'spam@example.com', role: 'USER', status: 'SUSPENDED', isVerified: false, joinedDate: '2024-01-01' },
];

export const usersService = {
  getUsers: async (_page = 1, _limit = 10): Promise<{ users: AdminUser[]; total: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ users: mockUsers, total: mockUsers.length });
      }, 500);
    });
  },
  updateStatus: async (id: string, status: AdminUser['status']): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === id);
        if (user) user.status = status;
        resolve();
      }, 300);
    });
  },
  updateRole: async (id: string, role: AdminUser['role']): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === id);
        if (user) user.role = role;
        resolve();
      }, 300);
    });
  }
};
