import Cookies from "js-cookie";
import { AUTH_KEYS } from "../constants/cookies";

export const TOKEN_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};



export const clearTokens = () => {
  Cookies.remove(AUTH_KEYS.ACCESS_TOKEN);
  Cookies.remove(AUTH_KEYS.REFRESH_TOKEN);
};
