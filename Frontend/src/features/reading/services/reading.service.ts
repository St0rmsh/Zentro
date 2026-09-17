import { axiosInstance } from "@/shared/lib/axios";
import { ReadingGoal, ReadingStreak, Achievement, ReadingHistoryItem } from '../types';

export const readingService = {
  getReadingData: async (): Promise<{ goal: ReadingGoal, streak: ReadingStreak, achievements: Achievement[], history: ReadingHistoryItem[] }> => {
    const response = await axiosInstance.get<{ data: { goal: ReadingGoal, streak: ReadingStreak, achievements: Achievement[], history: ReadingHistoryItem[] } }>("/reading/stats");
    return response.data.data;
  },

  syncProgress: async (postId: string, percentage: number, secondsSpent: number): Promise<void> => {
    await axiosInstance.post("/reading/sync", { postId, percentage, secondsSpent });
  },

  // Fire-and-forget sync for page unload / component unmount, where the browser may kill
  // the tab before a normal async request finishes. navigator.sendBeacon is designed to
  // survive that. Returns whether the browser accepted the beacon for delivery.
  syncProgressBeacon: (postId: string, percentage: number, secondsSpent: number): boolean => {
    if (typeof navigator === "undefined" || !navigator.sendBeacon) return false;

    const baseURL = axiosInstance.defaults.baseURL ?? "";
    const url = `${baseURL.replace(/\/$/, "")}/reading/sync`;
    const payload = JSON.stringify({ postId, percentage, secondsSpent });
    const blob = new Blob([payload], { type: "application/json" });

    return navigator.sendBeacon(url, blob);
  }
};