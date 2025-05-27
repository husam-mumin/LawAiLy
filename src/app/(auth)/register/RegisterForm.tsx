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

const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
    gender: z.enum(["male", "female"]),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
      });
    }
  });

type ErrorType = {
  title: string;
  description: string;
};

export default function RegisterForm() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<ErrorType | null>(null);
  useEffect(() => {
    document.title = "Register - MyApp";
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("work");

    if (!form.formState.isValid) {
      console.log("Form is invalid", form.formState.isValid);
      return;
    }

    const User = {
      email: data.email,
      password: data.password,
      gender: data.gender,
    };
    console.log("Form submitted:", User);
    setLoading(true);
    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(User),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Registration successful");
        } else {
          response.json().then((error) => {
            setError({
              title: "Registration Failed",
              description:
                error.error || "An error occurred during registration.",
            });
            console.error("Registration failed:", error);
          });
        }
      })
      .catch((error) => {
        setError({
          title: "Registration Error",
          description:
            error.message || "An error occurred during registration.",
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm Password"
                  required
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
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={"Gender"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Button
          type="submit"
          className="w-fit mx-auto bg-primary text-white py-2 px-10 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </Button>
        <div className="text-sm text-center text-secondary-foreground/80">
          Already have an account?{" "}
          <Link
            className="text-secondary-foreground/80 hover:text-secondary-foreground/100 transition-colors duration-200"
            href={"/login"}
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
