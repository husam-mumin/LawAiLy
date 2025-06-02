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
    .min(1, { message: "Email is required" })
    .email("invaild email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z
    .string()
    .min(6, "Confirm password must be at least 6 characters long"),
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
    document.title = "Register - MyApp";
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
        message: "Passwords do not match",
      });
      setLoading(false);
      return;
    }

    // Check if email exists before submitting
    try {
      const checkRes = await axios.post("/api/auth/checkEmail", {
        email: data.email,
      });
      if (checkRes.data.exists) {
        form.setError("email", {
          type: "manual",
          message: "Email already exists",
        });
        setLoading(false);
        return;
      }
    } catch (err) {
      setError({
        title: "Registration Error " + err,
        description: "Could not verify email existence.",
      });
      setLoading(false);
      return;
    }

    const User = {
      email: data.email,
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
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={"Gender"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
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
