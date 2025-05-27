"use client";
import { Button } from "@/components/ui/button";
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

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
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
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
    setLoading(true);
    // Handle login logic here
    const user = {
      email: data.email,
      password: data.password,
    };
    console.log("User data:", user);

    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login successful:", data);
        if (data.error) {
          throw new Error(data.error);
          setError({
            title: "Login Failed",
            description: data.error || "An error occurred while logging in.",
          });
        }
        // Handle successful login (e.g., redirect, show message)
        setError(null); // Clear any previous errors
        console.log("we get to user auth");

        router.push("/in"); // Redirect to dashboard or home page
        console.log("Redirecting to in...");
        // Optionally, you can store user data in local storage or context
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch((error) => {
        console.error("Login error:", error);
        // Handle login error (e.g., show error message)
        setError({
          title: "Login Failed",
          description: error.message || "An error occurred while logging in.",
        });
        setTimeout(() => {
          setError(null);
        }, 5000); // Clear error after 5 seconds
      })
      .finally(() => {
        setLoading(false);
      });
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
                <Input {...field} type="email" placeholder="Email" required />
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
                <Input
                  {...field}
                  type="password"
                  placeholder="Password"
                  required
                />
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
