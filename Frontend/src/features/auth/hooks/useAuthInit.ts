import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { hydrateAuthThunk, logoutThunk } from '../state/authThunks';
import { setLikedPosts } from '../../likes/state/likeSlice';
import { setBookmarkedPosts } from '../../bookmarks/state/bookmarkSlice';
import { registerLogoutCallback } from '@/shared/lib/axios';
import { socketService } from '@/shared/lib/socket';
import { setHydrationComplete } from '../state/authSlice';

/**
 * useAuthInit Hook
 * 
 * Initializes authentication on app startup:
 * 1. Dispatches hydrateAuthThunk to verify user session via HTTP-only cookies
 * 2. Connects Socket.IO on success
 * 3. Restores theme and sidebar state
 * 
 * Registers logout callback for token refresh failures
 * Listens for auth events from other browser tabs
 * 
 * Should be called once at app root level (e.g., in AppRouter or main App component)
 */
export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const { isAuthenticated, user, hydrationCompleted } = auth;
  const hasInitialized = useRef(false);

  // Register logout callback for axios
  useEffect(() => {
    registerLogoutCallback(() => {
      dispatch(logoutThunk());
    });
  }, [dispatch]);

  // Listen for authentication events from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_logout') {
        dispatch(logoutThunk());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  // Initial auth restoration
  useEffect(() => {
    // Prevent multiple initialization
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeAuth = async () => {
      try {
        const result = await dispatch(hydrateAuthThunk()).unwrap();
        if (result?.likedPosts) dispatch(setLikedPosts(result.likedPosts));
        if (result?.bookmarkedPosts) dispatch(setBookmarkedPosts(result.bookmarkedPosts));
        // If successful, user is authenticated, connect socket
        socketService.connect();
        
      } catch (error) {
        // Hydration failed (e.g. no cookies or expired refresh token)
        console.warn('Auth initialization failed (user not logged in)');
      } finally {
        // Mark hydration as complete regardless of outcome
        dispatch(setHydrationComplete(true));
        
        // Restore other app state
        restoreAppState();
      }
    };

    initializeAuth();
  }, [dispatch]);

  return { isAuthenticated, user, hydrationCompleted };
};

/**
 * Restore app state from localStorage
 * Includes theme, sidebar state, etc.
 */
function restoreAppState() {
  try {
    // Restore theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Restore other state as needed
  } catch (error) {
    console.error('Failed to restore app state:', error);
  }
}
