import { AdminTag } from '../types';

const mockTags: AdminTag[] = [
  { id: '1', name: 'react', isTrending: true, usageCount: 450 },
  { id: '2', name: 'diet', isTrending: false, usageCount: 120 },
  { id: '3', name: 'javascript', isTrending: true, usageCount: 800 },
];

export const tagsService = {
  getTags: async (_page = 1, _limit = 10): Promise<{ tags: AdminTag[]; total: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ tags: mockTags, total: mockTags.length });
      }, 500);
    });
  },
  updateTag: async (tag: AdminTag): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockTags.findIndex(t => t.id === tag.id);
        if (index !== -1) mockTags[index] = tag;
        resolve();
      }, 300);
    });
  },
  deleteTag: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockTags.findIndex(t => t.id === id);
        if (index !== -1) mockTags.splice(index, 1);
        resolve();
      }, 300);
    });
  }
};
