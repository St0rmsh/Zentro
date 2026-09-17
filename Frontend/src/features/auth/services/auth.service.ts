import { axiosInstance } from "@/shared/lib/axios";
import { LoginFormData } from "../schemas/login.schema";
import { RegisterFormData } from "../schemas/register.schema";
import { ForgotPasswordFormData } from "../schemas/forgotPassword.schema";
import { ResetPasswordFormData } from "../schemas/resetPassword.schema";
import { ChangePasswordFormData } from "../schemas/changePassword.schema";
import { LoginResponse, RegisterResponse } from "../types/auth.types";
import { ApiResponse } from "@/shared/types/api.types";
import { User } from "@/shared/types/user.types";
export interface UserSettingsResponse {
  privacy: { privateAccount: boolean; activityStatus: boolean; searchVisibility: boolean };
  settings: { theme: "light" | "dark" | "system"; language: "en" | "es" | "fr" | "de"; reducedMotion: boolean; compactMode: boolean; autoPlayMedia: boolean };
  notificationPreferences: { likes: boolean; comments: boolean; follows: boolean; mentions: boolean; bookmarks: boolean };
}

export const authService = {
  login: async (data: LoginFormData) => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>("/auth/login", data);    
    return response.data;
  },

  register: async (data: RegisterFormData) => {
    const response = await axiosInstance.post<ApiResponse<RegisterResponse>>("/auth/register", data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get<ApiResponse<User>>("/auth/me");
    console.log("Current User:", response.data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post<ApiResponse>("/auth/logout");
    return response.data;
  },

  sendOtp: async (email?: string) => {
    const response = await axiosInstance.post<ApiResponse>("/auth/send-otp", email ? { email } : undefined);
    return response.data;
  },

  verifyOtp: async (otp: string, email?: string) => {
    const response = await axiosInstance.post<ApiResponse>("/auth/verify-otp", { otp, ...(email ? { email } : {}) });
    return response.data;
  },

  changePassword: async (data: ChangePasswordFormData) => {
    const response = await axiosInstance.patch<ApiResponse>("/auth/change-password", data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordFormData) => {
    const response = await axiosInstance.post<ApiResponse>("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordFormData) => {
    const response = await axiosInstance.post<ApiResponse>("/auth/reset-password", data);
    return response.data;
  },

  getSettings: async () => {
    const response = await axiosInstance.get<ApiResponse<UserSettingsResponse>>("/auth/settings");
    return response.data.data;
  },

  updateSettings: async (data: Record<string, string | boolean>) => {
    const response = await axiosInstance.patch<ApiResponse<unknown>>("/auth/settings", data);
    return response.data;
  },

  deactivateAccount: async () => {
    await axiosInstance.patch("/auth/deactivate");
  },

  deleteAccount: async () => {
    await axiosInstance.delete("/auth/account");
  },

  getPrivacyLists: async () => {
    const response = await axiosInstance.get<ApiResponse<{ blockedUsers: User[]; mutedUsers: User[] }>>("/auth/privacy-lists");
    return response.data.data;
  },

  updatePrivacyList: async (list: "blockedUsers" | "mutedUsers", username: string, add: boolean) => {
    const response = await axiosInstance.patch<ApiResponse<User[]>>(`/auth/privacy-lists/${list}`, { username, add });
    return response.data.data;
  },
};
