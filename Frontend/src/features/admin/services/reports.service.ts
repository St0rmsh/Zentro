import { AdminReport } from '../types';

const mockReports: AdminReport[] = [
  { id: '1', reporter: { id: '1', username: 'johndoe' }, reason: 'Spam comment', targetType: 'COMMENT', targetId: '2', status: 'PENDING', createdDate: '2024-03-15' },
  { id: '2', reporter: { id: '2', username: 'janedoe' }, reason: 'Inappropriate Post', targetType: 'POST', targetId: '3', status: 'RESOLVED', createdDate: '2024-03-14' },
];

export const reportsService = {
  getReports: async (_page = 1, _limit = 10): Promise<{ reports: AdminReport[]; total: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ reports: mockReports, total: mockReports.length });
      }, 500);
    });
  },
  updateStatus: async (id: string, status: AdminReport['status']): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = mockReports.find(r => r.id === id);
        if (report) report.status = status;
        resolve();
      }, 300);
    });
  }
};
