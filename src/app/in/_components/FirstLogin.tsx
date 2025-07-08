import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { UserProfileFormValues, userProfileSchema } from "../userProfileSchema";
import { useUser } from "@/app/context/UserContext";
import { motion } from "framer-motion";
import { useGsapFadeIn } from "./useGsapFadeIn";

type FirstLoginProps = { onSubmit: (data: UserProfileFormValues) => void };
export default function FirstLogin({ onSubmit }: FirstLoginProps) {
  const { user } = useUser();
  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
    mode: "onChange",
  });

  // GSAP fade-in for the card (must be called unconditionally)
  const cardRef = useGsapFadeIn();

  if (!user) {
    return null; // or handle the case where user is not defined
  }

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center justify-center z-[900]"
    >
      <div
        ref={cardRef}
        className="first-login-card max-w-md w-full mx-auto p-8 rounded-2xl shadow-2xl bg-white border border-blue-100"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
          className="flex flex-col items-center mb-6"
        >
          <div className="w-16 h-16 mb-2 rounded-full bg-blue-50 flex items-center justify-center shadow">
            <svg
              width="36"
              height="36"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.663-5.33-4-8-4z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold mb-1 text-center text-blue-900 tracking-tight drop-shadow-sm">
            مرحباً بك في <span className="text-blue-700">مستشاري</span>
            {user.firstName ? `، ${user.firstName}` : ""}!
          </h1>
          <p className="mb-2 text-center text-gray-500 text-sm">
            منصة ذكية لعرض الوثائق القانونية، والدردشة مع الذكاء الاصطناعي
            المتخصص في القوانين الميراث.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-6 text-center text-blue-700 font-semibold text-base"
        >
          يرجى إكمال بياناتك الشخصية للمتابعة:
        </motion.div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right text-blue-900 font-medium">
                      الاسم الأول
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="أدخل اسمك الأول"
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right text-blue-900 font-medium">
                      اسم العائلة
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="أدخل اسم العائلة"
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-500 transition-colors font-bold text-lg shadow-md disabled:opacity-60"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting
                  ? "جارٍ الحفظ..."
                  : "حفظ البيانات والمتابعة"}
              </Button>
            </motion.div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
