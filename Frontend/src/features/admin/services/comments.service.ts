import { AdminComment } from '../types';

const mockComments: AdminComment[] = [
  { id: '1', content: 'Great article!', author: { id: '1', username: 'johndoe' }, post: { id: '2', title: 'Healthy Eating Habits' }, createdDate: '2024-03-13', status: 'VISIBLE' },
  { id: '2', content: 'This is spam.', author: { id: '3', username: 'spammer' }, post: { id: '1', title: 'Getting Started with React' }, createdDate: '2024-03-15', status: 'HIDDEN' },
];

export const commentsService = {
  getComments: async (_page = 1, _limit = 10): Promise<{ comments: AdminComment[]; total: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ comments: mockComments, total: mockComments.length });
      }, 500);
    });
  },
  updateStatus: async (id: string, status: AdminComment['status']): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comment = mockComments.find(c => c.id === id);
        if (comment) comment.status = status;
        resolve();
      }, 300);
    });
  }
};
