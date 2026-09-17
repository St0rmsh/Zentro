export type AdminRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser {
  id: string;
  avatar?: string;
  username: string;
  email: string;
  role: AdminRole;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  isVerified: boolean;
  joinedDate: string;
}

export interface AdminPost {
  id: string;
  coverImage?: string;
  title: string;
  author: {
    id: string;
    username: string;
  };
  category: string;
  createdDate: string;
  views: number;
  likes: number;
  comments: number;
  isFeatured: boolean;
  isHidden: boolean;
}

export interface AdminComment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  post: {
    id: string;
    title: string;
  };
  createdDate: string;
  status: 'VISIBLE' | 'HIDDEN' | 'DELETED';
}

export interface AdminReport {
  id: string;
  reporter: {
    id: string;
    username: string;
  };
  reason: string;
  targetType: 'USER' | 'POST' | 'COMMENT';
  targetId: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  createdDate: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  order: number;
  isVisible: boolean;
}

export interface AdminTag {
  id: string;
  name: string;
  isTrending: boolean;
  usageCount: number;
}
