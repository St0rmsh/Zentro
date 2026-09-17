import { RecommendedPost, RecommendedUser, TrendingTag, TrendingCategory } from '../types';

const mockFeed: RecommendedPost[] = [
  { id: '1', title: 'The Future of AI in Web Development', excerpt: 'How AI is changing the way we build the web...', author: { id: '1', username: 'ai_expert' }, category: 'Technology', readingTime: 5, publishedAt: new Date().toISOString(), reason: 'Trending Today' },
  { id: '2', title: '10 Tips for Better Sleep', excerpt: 'Improve your sleep quality with these simple tips.', author: { id: '2', username: 'health_guru' }, category: 'Health', readingTime: 3, publishedAt: new Date().toISOString(), reason: 'Because you liked Health' },
  { id: '3', title: 'Understanding React Server Components', excerpt: 'A deep dive into RSC and why they matter.', author: { id: '3', username: 'react_dev' }, category: 'Programming', readingTime: 8, publishedAt: new Date().toISOString(), reason: 'Recommended for you' },
];

const mockTrendingTags: TrendingTag[] = [
  { id: '1', name: 'AI', usageCount: 15420 },
  { id: '2', name: 'WebDev', usageCount: 8210 },
  { id: '3', name: 'React', usageCount: 6540 },
  { id: '4', name: 'Health', usageCount: 3120 },
  { id: '5', name: 'Design', usageCount: 2900 },
];

const mockTrendingCategories: TrendingCategory[] = [
  { id: '1', name: 'Technology', slug: 'technology', postCount: 25000 },
  { id: '2', name: 'Programming', slug: 'programming', postCount: 18000 },
  { id: '3', name: 'Design', slug: 'design', postCount: 12000 },
];

const mockRecommendedUsers: RecommendedUser[] = [
  { id: '4', username: 'design_pro', bio: 'UI/UX Designer | Speaker', followers: 12500, mutualInterests: ['Design', 'Technology'] },
  { id: '5', username: 'startup_guy', bio: 'Building the next big thing.', followers: 8200, mutualInterests: ['Business'] },
];

export const recommendationService = {
  getFeed: async (): Promise<RecommendedPost[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFeed);
      }, 600);
    });
  },
  
  getTrending: async (): Promise<{ posts: RecommendedPost[], tags: TrendingTag[], categories: TrendingCategory[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ posts: mockFeed, tags: mockTrendingTags, categories: mockTrendingCategories });
      }, 500);
    });
  },

  getRecommendedUsers: async (): Promise<RecommendedUser[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRecommendedUsers);
      }, 400);
    });
  }
};
