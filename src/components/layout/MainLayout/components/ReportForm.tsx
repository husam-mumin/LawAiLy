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
  name: z.string().min(2, { message: "يرجى إدخال اسمك" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  message: z
    .string()
    .min(1, { message: "يرجى إدخال رسالة" })
    .min(10, { message: "يرجى إدخال رسالة اطول" }),
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
    const mailText = `الاسم: ${values.name}\nالبريد الإلكتروني: ${values.email}\nالرسالة: ${values.message}`;
    const response = await sendMail({
      email: values.email.trim(),
      subject: "بلاغ من المستخدم " + values.name,
      text: mailText,
    });
    if (response?.messageId) {
      toast.success("تم الإرسال بنجاح");
      setOpen(false);
    } else {
      toast.error("لم تنجح العملية");
    }
  };

  return (
    <Form {...form}>
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="">
          <h2 className="mb-2">الاسم</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="حسن محمد" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h2 className="my-2">البريد الإلكتروني</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="ahmed@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h2 className="my-2">الرسالة</h2>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="يرجى كتابة تفاصيل البلاغ أو المشكلة هنا"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="mt-5">
            {isLoading ? "...جاري الإرسال" : "إرسال"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
