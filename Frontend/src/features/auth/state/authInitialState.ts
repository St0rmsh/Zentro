import { AuthState } from "../types/auth.types";

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isHydrating: true,
  hydrationCompleted: false,
  authChecked: false,
};
