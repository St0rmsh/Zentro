import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/shared/hooks';
import { updateCurrentSession } from '../state/readingSlice';
import { readingService } from '../services/reading.service';

const HEARTBEAT_INTERVAL_MS = 20000;

export const useScrollProgress = (postId: string | undefined) => {
  const dispatch = useAppDispatch();
  const maxPercentageRef = useRef(0);
  const lastFlushRef = useRef<number>(Date.now());
  const visibleRef = useRef<boolean>(document.visibilityState === 'visible');

  useEffect(() => {
    if (!postId) return;

    // Reset tracking state when the post changes
    maxPercentageRef.current = 0;
    lastFlushRef.current = Date.now();
    visibleRef.current = document.visibilityState === 'visible';

    dispatch(updateCurrentSession({ postId, scrollPercentage: 0 }));

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const calculateProgress = () => {
      // Calculate scroll percentage
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const scrollableHeight = documentHeight - windowHeight;
      const percentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 100;
      const clamped = Math.min(100, Math.max(0, percentage));

      maxPercentageRef.current = Math.max(maxPercentageRef.current, clamped);
      dispatch(updateCurrentSession({ scrollPercentage: clamped }));
    };

    const handleScroll = () => {
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        calculateProgress();
        throttleTimer = null;
      }, 100); // Throttle to max 10 times a second
    };

    // Regular in-page flush (heartbeat, tab hidden). The page is still alive here, so a
    // normal async request is fine.
    const flush = () => {
      const now = Date.now();
      const elapsedSeconds = visibleRef.current ? (now - lastFlushRef.current) / 1000 : 0;
      lastFlushRef.current = now;

      if (elapsedSeconds > 0 || maxPercentageRef.current > 0) {
        void readingService.syncProgress(postId, maxPercentageRef.current, Math.max(0, elapsedSeconds));
      }
    };

    // Final flush on unmount/unload. The browser may kill the tab before a normal request
    // finishes, so this uses sendBeacon (falling back to the regular async call only if the
    // browser rejects the beacon, e.g. payload too large).
    const flushFinal = () => {
      const now = Date.now();
      const elapsedSeconds = visibleRef.current ? (now - lastFlushRef.current) / 1000 : 0;
      lastFlushRef.current = now;

      if (elapsedSeconds <= 0 && maxPercentageRef.current <= 0) return;

      const sent = readingService.syncProgressBeacon(postId, maxPercentageRef.current, Math.max(0, elapsedSeconds));
      if (!sent) {
        void readingService.syncProgress(postId, maxPercentageRef.current, Math.max(0, elapsedSeconds));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flush();
        visibleRef.current = false;
      } else {
        lastFlushRef.current = Date.now();
        visibleRef.current = true;
      }
    };

    // Also catch outright tab/browser close, which doesn't always trigger the React
    // cleanup function in time.
    const handlePageHide = () => {
      flushFinal();
    };

    // Calculate initial progress
    calculateProgress();

    const heartbeat = setInterval(flush, HEARTBEAT_INTERVAL_MS);

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      if (throttleTimer) clearTimeout(throttleTimer);
      clearInterval(heartbeat);
      flushFinal(); // final flush so the last partial interval isn't lost
    };
  }, [postId, dispatch]);
};