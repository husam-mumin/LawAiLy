"use client";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoginAlert from "../_components/authAlert";
import { AtomIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginRequestType } from "@/app/api/auth/login/route";

const formSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { message: "email required" })
      .email("Invalid email "),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .superRefine(async ({ email }, ctx) => {
    if (!email) return;
    const response = await axios.post("/api/auth/checkEmail", {
      email: email.trim(),
    });
    const { exists } = response.data;
    if (!exists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email not found. Please check and try again.",
        path: ["email"],
      });
    }
  });

type ErrorType = {
  title: string;
  description: string;
};
export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);
  useEffect(() => {
    document.title = "Login - MyApp";
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      // Handle login logic here
      const user = {
        email: data.email.trim(),
        password: data.password,
      };

      const response = await axios.post("/api/auth/login", {
        user,
      });

      const resdata: loginRequestType = response.data;

      if (resdata.error) {
        setError({
          title: "Login Failed",
          description: resdata.error || "An error occurred while logging in.",
        });
        throw new Error(resdata.error);
      }
      // Handle successful login (e.g., redirect, show message)
      setError(null); // Clear any previous errors

      router.push("/in"); // Redirect to dashboard or home page
      // Optionally, you can store user data in local storage or context
    } catch (err: unknown) {
      // todo complete this catch
      console.error("Login error:", error);
      // Handle login error (e.g., show error message)
      if (err instanceof AxiosError) {
        if (err.status === 401) {
          form.setError("password", {
            type: "validate",
            message: "wrong password, Please check and try again.",
          });
        }
        if (err.response?.data?.statusCode === 401) {
          setError({
            title: "Login Failed",
            description:
              error?.description || "An error occurred while logging in.",
          });
        }
      }
      setTimeout(() => {
        setError(null);
      }, 5000); // Clear error after 5 seconds
    }

    setLoading(false);
  };
  return (
    <Form {...form}>
      {error && (
        <LoginAlert
          title={error.title}
          description={error.description}
          Icon={AtomIcon}
        />
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-80 p-6  rounded-lg"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email" />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-fit mx-auto  bg-primary text-white py-2 px-10 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
