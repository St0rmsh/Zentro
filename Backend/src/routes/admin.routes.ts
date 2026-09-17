import { Router } from 'express';
import { getDashboardStats, getUsers, updateUserRole } from '../controller/admin.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all admin routes and restrict to ADMIN role
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

// Dashboard Stats
router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', getUsers);
router.patch('/users/:userId/role', updateUserRole);

// Further routes for Moderation, Posts, Reports would go here

export default router;
