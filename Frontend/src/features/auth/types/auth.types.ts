import { User } from '@/shared/types/user.types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  /** True while the initial hydration request is in-flight */
  isHydrating: boolean;
  /** True once the initial hydration attempt has finished (success or failure) */
  hydrationCompleted: boolean;
  /** True once the auth check against the backend has been performed at least once */
  authChecked: boolean;
}
