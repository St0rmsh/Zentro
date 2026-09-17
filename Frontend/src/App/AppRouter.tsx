import { useRoutes } from 'react-router-dom';
import { routes } from '../router';
import { useAuthInit } from '@/features/auth/hooks/useAuthInit';

/**
 * App Router Component
 * Initializes authentication and renders all application routes
 * 
 * useAuthInit ensures:
 * - Stored tokens are verified on app startup
 * - Socket.IO is reconnected with current token
 * - Redux auth state is restored
 * - Authentication events from other tabs are synced
 */
export function AppRouter() {
  // Initialize authentication on app startup
  useAuthInit();

  return useRoutes(routes);
}
