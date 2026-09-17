import { AnalyticsData } from '../state/adminAnalyticsSlice';

const mockAnalytics: AnalyticsData = {
  userGrowth: [
    { name: "Jan", users: 400 },
    { name: "Feb", users: 600 },
    { name: "Mar", users: 800 },
    { name: "Apr", users: 1200 },
    { name: "May", users: 1500 },
    { name: "Jun", users: 2100 },
    { name: "Jul", users: 2800 },
  ],
  postActivity: [
    { name: "Mon", posts: 24 },
    { name: "Tue", posts: 35 },
    { name: "Wed", posts: 42 },
    { name: "Thu", posts: 38 },
    { name: "Fri", posts: 55 },
    { name: "Sat", posts: 65 },
    { name: "Sun", posts: 48 },
  ],
  totalUsers: 12482,
  totalPosts: 48291,
  totalComments: 142884,
  totalReports: 34,
};

export const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAnalytics);
      }, 600);
    });
  }
};
