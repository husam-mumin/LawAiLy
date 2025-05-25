"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { sendMail } from "../lib/send-mail";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Please Enter Your Name" }),
  email: z.string().email({ message: "Please Enter a Valid Email" }),
  message: z.string().min(10, { message: "Please Enter a Message" }),
});

export default function ReportForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    const mailText = `Name: ${values.name}\nEmail: ${values.email}\nMessage: ${values.message}`;
    const response = await sendMail({
      email: values.email,
      subject: "Error from user" + values.name,
      text: mailText,
    });
    if (response?.messageId) {
      toast.success("Message Sent Successfully");
      setOpen(false);
    } else {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <Form {...form}>
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="">
          <h2 className="mb-2">Name</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h2 className="my-2">Email:</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h2 className="my-2">Message</h2>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="My question is which framework do you prefer to use?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="mt-5">
            {isLoading ? "Sending....." : "Send"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
