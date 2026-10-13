
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "الاسم يجب أن يكون حرفين على الأقل"),

    phone: z
      .string()
      .trim()
      .regex(/^01[0125][0-9]{8}$/, "رقم الموبايل غير صحيح"),


    email: z
      .email("البريد الإلكتروني غير صحيح")
      .toLowerCase(),

    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),

    confirmPassword: z
      .string()
      .min(1, "يرجى تأكيد كلمة المرور"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
