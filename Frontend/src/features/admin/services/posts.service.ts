import { AdminPost } from '../types';

const mockPosts: AdminPost[] = [
  { id: '1', title: 'Getting Started with React', author: { id: '1', username: 'johndoe' }, category: 'Technology', createdDate: '2024-03-10', views: 1200, likes: 300, comments: 45, isFeatured: true, isHidden: false },
  { id: '2', title: 'Healthy Eating Habits', author: { id: '2', username: 'janedoe' }, category: 'Health', createdDate: '2024-03-12', views: 800, likes: 150, comments: 20, isFeatured: false, isHidden: false },
  { id: '3', title: 'Offensive Post', author: { id: '3', username: 'spammer' }, category: 'General', createdDate: '2024-03-14', views: 10, likes: 0, comments: 0, isFeatured: false, isHidden: true },
];

export const postsService = {
  getPosts: async (_page = 1, _limit = 10): Promise<{ posts: AdminPost[]; total: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ posts: mockPosts, total: mockPosts.length });
      }, 500);
    });
  },
  toggleVisibility: async (id: string, isHidden: boolean): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = mockPosts.find(p => p.id === id);
        if (post) post.isHidden = isHidden;
        resolve();
      }, 300);
    });
  },
  toggleFeatured: async (id: string, isFeatured: boolean): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = mockPosts.find(p => p.id === id);
        if (post) post.isFeatured = isFeatured;
        resolve();
      }, 300);
    });
  }
};
