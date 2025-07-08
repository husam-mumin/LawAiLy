import { z } from "zod";

export const userProfileSchema = z.object({
  firstName: z.string().min(2, "الاسم الأول مطلوب"),
  lastName: z.string().min(2, "اسم العائلة مطلوب"),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
