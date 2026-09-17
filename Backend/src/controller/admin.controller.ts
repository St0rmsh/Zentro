import type { Request, Response } from 'express';
import User from '../model/auth.model.js';
import Post from '../model/post.model.js';
import Comment from '../model/comment.model.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    // Assuming there is a Report model or some logic, for now using dummy logic or leaving out
    
    // Calculate simple growth (mock data for now, would require historical snapshots in a real app)
    const stats = {
      users: { total: totalUsers, growth: 12.5 },
      posts: { total: totalPosts, growth: 8.2 },
      comments: { total: totalComments, growth: 15.3 },
      reports: { total: 34, growth: -5.1 }
    };
    
    sendSuccess(res, 200, 'Dashboard stats retrieved', stats);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    sendSuccess(res, 200, 'Users retrieved successfully', {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'author', 'admin'].includes(role)) {
      return sendError(res, 400, 'Invalid role');
    }

    const user = await User.findByIdAndUpdate(userId, { roles: [role] }, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 200, 'User role updated successfully', user);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
