import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { hydrateAuthThunk } from "../state/authThunks";
import { selectAuthIsAuthenticated, selectHydrationCompleted } from "../state/authSelectors";

export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectAuthIsAuthenticated);
  const hydrationCompleted = useAppSelector(selectHydrationCompleted);
  const initialized = useRef(false);

  useEffect(() => {
    // Only fetch if we aren't authenticated yet and haven't hydrated
    if (!initialized.current && !hydrationCompleted) {
      dispatch(hydrateAuthThunk());
      initialized.current = true;
    }
  }, [dispatch, hydrationCompleted]);

  return { isAuthenticated };
};
