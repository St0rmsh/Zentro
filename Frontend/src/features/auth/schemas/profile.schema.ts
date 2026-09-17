import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters").optional(),
  fullname: z.string().min(2, "Fullname must be at least 2 characters").optional(),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
