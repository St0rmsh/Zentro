import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/auth.service";
import { profileService } from "../services/profile.service";
import { LoginFormData } from "../schemas/login.schema";
import { RegisterFormData } from "../schemas/register.schema";
import { ProfileFormData } from "../schemas/profile.schema";
import { ForgotPasswordFormData } from "../schemas/forgotPassword.schema";
import { ResetPasswordFormData } from "../schemas/resetPassword.schema";
import { ChangePasswordFormData } from "../schemas/changePassword.schema";
import { handleApiError } from "@/shared/utils/errorHandler";
import { socketService } from "@/shared/lib/socket";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        socketService.connect();
        
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      if (response.success && response.data) {
        socketService.connect();
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const hydrateAuthThunk = createAsyncThunk(
  "auth/hydrateAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Local logout must still complete if the session has already expired.
      console.warn("Remote logout failed; clearing the local session.", error);
    } finally {
      socketService.disconnect();
    }
    return true;
  }
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (
    payload: { data: ProfileFormData; avatarFile?: File; bannerFile?: File },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileService.updateProfile(
        payload.data,
        payload.avatarFile,
        payload.bannerFile
      );
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordFormData, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(data);
      return response.message;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordFormData, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      return response.message;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (data: ChangePasswordFormData, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(data);
      return response.message;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const sendOtpThunk = createAsyncThunk(
  "auth/sendOtp",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtp();
      return response.message;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (data: { otp: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(data.otp);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
