import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./index";
import {setGlobalLoading,startOperation,stopOperation,} from "@/store/slices/loadingSlice";

/**
 * useLoading Hook
 * Provides access to global and operation-specific loading states
 */
export function useLoading() {
  const dispatch = useAppDispatch();
  const { globalLoading, operations } = useAppSelector((state) => state.loading);

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(setGlobalLoading(loading));
    },
    [dispatch]
  );

  const setOpLoading = useCallback(
    (operationId: string, loading: boolean) => {
      if (loading) {
        dispatch(startOperation(operationId));
      } else {
        dispatch(stopOperation(operationId));
      }
    },
    [dispatch]
  );

  const isOperationLoading = useCallback(
    (operationId: string) => {
      return !!operations[operationId];
    },
    [operations]
  );

  return {
    isLoading: globalLoading,
    operations,
    setLoading,
    setOperationLoading: setOpLoading,
    isOperationLoading,
  };
}
