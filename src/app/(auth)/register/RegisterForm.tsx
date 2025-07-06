import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@radix-ui/react-select";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Authalert from "../_components/authAlert";
import { User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "البريد الإلكتروني مطلوب" })
    .email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z
    .string()
    .min(6, "تأكيد كلمة المرور يجب أن يكون 6 أحرف على الأقل"),
  gender: z.enum(["male", "female"]),
});

type ErrorType = {
  title: string;
  description: string;
};

export default function RegisterForm() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<ErrorType | null>(null);
  const router = useRouter();
  useEffect(() => {
    document.title = "إنشاء حساب - Lawaily";
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      gender: "male",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);

    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "كلمتا المرور غير متطابقتين",
      });
      setLoading(false);
      return;
    }

    // Check if email exists before submitting
    try {
      const checkRes = await axios.post("/api/auth/checkEmail", {
        email: data.email.trim(),
      });
      if (checkRes.data.exists) {
        form.setError("email", {
          type: "manual",
          message: checkRes.data.error
            ? checkRes.data.error
            : "البريد الإلكتروني مستخدم بالفعل",
        });
        setLoading(false);
        return;
      }
    } catch (err) {
      setError({
        title: "خطأ في التسجيل " + err,
        description: "تعذر التحقق من وجود البريد الإلكتروني.",
      });
      setLoading(false);
      return;
    }

    const User = {
      email: data.email.trim(),
      password: data.password,
      gender: data.gender,
    };

    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(User),
    })
      .then((response) => {
        if (response.ok) {
          router.push("/login");
        } else {
          response.json().then((error) => {
            setError({
              title: "فشل التسجيل",
              description:
                error.error || "حدث خطأ أثناء عملية التسجيل.",
            });
            console.error("Registration failed:", error);
          });
        }
      })
      .catch((error) => {
        setError({
          title: "خطأ في التسجيل",
          description:
            error.message || "حدث خطأ أثناء عملية التسجيل.",
        });
        console.error("Error during registration:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-80 p-6 rounded-lg"
        dir="rtl"
      >
        {error && (
          <Authalert
            Icon={User2Icon}
            title={error.title}
            description={error.description}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input {...field} placeholder="البريد الإلكتروني" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="كلمة المرور" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تأكيد كلمة المرور</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الجنس</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={"الجنس"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-fit mx-auto bg-primary text-white py-2 px-10 rounded"
        >
          {loading ? "جاري التسجيل..." : "إنشاء حساب"}
        </Button>
        <div className="text-sm text-center text-secondary-foreground/80">
          لديك حساب بالفعل؟{" "}
          <Link
            className="text-secondary-foreground/80 hover:text-secondary-foreground/100 transition-colors duration-200"
            href={"/login"}
          >
            تسجيل الدخول
          </Link>
        </div>
      </form>
    </Form>
  );
}
