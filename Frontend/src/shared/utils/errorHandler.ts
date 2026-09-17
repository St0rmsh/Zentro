import { AxiosError } from "axios";
import { ApiErrorResponse } from "../types/api.types";

export const handleApiError = (error: unknown, fallbackMessage = "An unexpected error occurred."): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    if (data && data.message) {
      return data.message;
    }
    if (error.response?.status === 401) {
      return "Invalid credentials or session expired.";
    }
  }
  return fallbackMessage;
};
