import { AdminCategory } from '../types';

const mockCategories: AdminCategory[] = [
  { id: '1', name: 'Technology', slug: 'technology', color: '#3b82f6', description: 'Tech news and articles', order: 1, isVisible: true },
  { id: '2', name: 'Health', slug: 'health', color: '#10b981', description: 'Health and wellness', order: 2, isVisible: true },
];

export const categoriesService = {
  getCategories: async (): Promise<{ categories: AdminCategory[]; total: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ categories: mockCategories, total: mockCategories.length });
      }, 500);
    });
  },
  createCategory: async (category: Omit<AdminCategory, 'id'>): Promise<AdminCategory> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCat = { ...category, id: Math.random().toString() };
        mockCategories.push(newCat);
        resolve(newCat);
      }, 400);
    });
  },
  updateCategory: async (category: AdminCategory): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCategories.findIndex(c => c.id === category.id);
        if (index !== -1) mockCategories[index] = category;
        resolve();
      }, 300);
    });
  },
  deleteCategory: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCategories.findIndex(c => c.id === id);
        if (index !== -1) mockCategories.splice(index, 1);
        resolve();
      }, 300);
    });
  }
};
