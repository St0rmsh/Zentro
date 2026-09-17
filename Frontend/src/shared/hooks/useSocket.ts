import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./index";
import { socketService } from "@/shared/lib/socket";
import { setConnected } from "@/store/slices/socketSlice";

/**
 * useSocket Hook
 * Provides access to Socket.IO functionality
 */
export function useSocket() {
  const dispatch = useAppDispatch();
  const { isConnected } = useAppSelector((state) => state.socket);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Auto-connect when authenticated
  useEffect(() => {

    if (isAuthenticated && !isConnected) {
      socketService.connect();
    }

    // Listen for connection changes
    const unsubscribe = socketService.onConnectionChange((connected) => {
      dispatch(setConnected(connected));
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, isConnected, dispatch]);

  const emit = useCallback(
    (event: string, data?: unknown) => {
      socketService.emit(event, data);
    },
    []
  );

  const on = useCallback(
    (event: string, callback: (...args: unknown[]) => void) => {
      socketService.on(event, callback);
      return () => socketService.off(event, callback);
    },
    []
  );

  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    socketService.off(event, callback);
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  return {
    isConnected,
    emit,
    on,
    off,
    disconnect,
  };
}
