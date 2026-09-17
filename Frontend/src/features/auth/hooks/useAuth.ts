import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {selectAuthUser,selectAuthIsAuthenticated,selectAuthLoading,selectAuthError,selectHydrationCompleted} from "../state/authSelectors";
import {loginThunk,registerThunk,logoutThunk,updateProfileThunk} from "../state/authThunks";
import { clearError } from "../state/authSlice";
import { LoginFormData } from "../schemas/login.schema";
import { RegisterFormData } from "../schemas/register.schema";
import { ProfileFormData } from "../schemas/profile.schema";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectAuthIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const hydrationCompleted = useAppSelector(selectHydrationCompleted);

  const login = useCallback(
    (data: LoginFormData) => dispatch(loginThunk(data)).unwrap(),
    [dispatch]
  );

  const register = useCallback(
    (data: RegisterFormData) => dispatch(registerThunk(data)).unwrap(),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutThunk()).unwrap(), [dispatch]);

  const updateProfile = useCallback(
    (data: ProfileFormData, avatarFile?: File, bannerFile?: File) =>
      dispatch(updateProfileThunk({ data, avatarFile, bannerFile })).unwrap(),
    [dispatch]
  );

  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    hydrationCompleted,
    login,
    register,
    logout,
    updateProfile,
    resetError,
  };
};
