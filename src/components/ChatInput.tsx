"use client";
import React from "react";
import { ArrowUp, Clock } from "lucide-react";
import { useFormStatus } from "react-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactProps from "@/Types/ReactProps";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useMobileKeybard } from "@/hooks/useKeyboardFix";

export const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  chatId: z.string().optional(),
});
type ChatInputProps = {
  value?: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onAttachFile: (file: File) => void;
  attachFile?: File | null;
  loading?: boolean;
  fileLoading?: boolean;
} & ReactProps;

export default function ChatInput({
  value,
  onChange,
  onSend,
  onAttachFile,
  attachFile,
  className,
  loading = false,
  fileLoading = false,
}: ChatInputProps) {
  const { pending } = useFormStatus();
  const username = "User"; // Replace with actual username logic
  const { handleMobileKeybard } = useMobileKeybard();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: value || "",
      username: username,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSend)} className="">
        <div
          className={`flex flex-col items-center border-2 relative dark:bg-input/30 bg-white rounded-lg shadow-md px-[8px]  py-[8px]
    ${className ? className : ""}`}
        >
          <div className="flex flex-col ">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={value}
                  onFocus={handleMobileKeybard}
                  className="resize-none dark:text-base w-[20rem] md:w-[33rem] max-h-[15rem]  ring-0 dark:ring-0 border-none bg-transparent dark:bg-transparent text-right"
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="اكتب هنا"
                />
              )}
            />
            <div className="flex   items-center justify-between w-full mt-2">
              <Button
                {...(pending && { disabled: true })}
                className=" rounded-full"
                variant="default"
                onClick={() => {
                  onSend();
                  form.reset();
                }}
              >
                {loading ? (
                  <Clock size={20} className="animate-spin" />
                ) : pending ? (
                  <Clock size={20} />
                ) : (
                  <ArrowUp size={20} />
                )}
              </Button>
              <div>
                {fileLoading ? (
                  <Clock size={20} className="animate-spin" />
                ) : (
                  <Label className="cursor-pointer">
                    <Input
                      type="file"
                      accept="image/*,video/*,audio/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.currentTarget.files && e.currentTarget.files[0]) {
                          onAttachFile(e.currentTarget.files[0]);
                        }
                      }}
                    />
                    ارفق ملف
                  </Label>
                )}
                {attachFile && (
                  <span className="text-sm text-gray-500 ms-2">
                    Attached: {attachFile.name.slice(0, 20)}
                    {attachFile.name.length > 20 && "..."}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
