import { RootState } from "../../../store";

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectHydrationCompleted = (state: RootState) => state.auth.hydrationCompleted;
export const selectIsHydrating = (state: RootState) => state.auth.isHydrating;
export const selectAuthChecked = (state: RootState) => state.auth.authChecked;
