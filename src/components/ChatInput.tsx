"use client";
import React, { useRef } from "react";
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
import { Image as ImageIcon, File as FileIcon } from "lucide-react";
import { userType } from "@/models/Users";

export const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }).optional(),
  userId: z.string().optional(),
  Files: z.array(z.instanceof(File)).optional(),
});
type ChatInputProps = {
  onSend: (
    message: string,
    user: string,
    flies?: File[] | null
  ) => Promise<void>;
  loading?: boolean;
  user: userType;
  fileLoading?: boolean;
} & ReactProps;

export default function ChatInput({
  onSend,
  className,
  user,
  loading = false,
  fileLoading = false,
}: ChatInputProps) {
  const { pending } = useFormStatus();
  const { handleMobileKeybard } = useMobileKeybard();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Always call hooks at the top level
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      userId: user?._id || "",
      Files: [],
    },
  });

  // Handle form submit
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (!user) {
      return;
    }
    if (!data.message || data.message.trim().length === 0) {
      return;
    }
    if (!loading && !pending) {
      onSend(data.message, user._id, data.Files);
      form.reset({ message: "", Files: [] });
    }
  };

  // Handle file attach and reset input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const filesArray = Array.from(e.currentTarget.files);
      // Add new files to form Files field
      const currentFiles = form.getValues("Files") || [];
      form.setValue("Files", [...currentFiles, ...filesArray]);
      // Reset file input so same file can be re-attached if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove a file from the attached files list
  const handleRemoveFile = (index: number) => {
    const currentFiles = form.getValues("Files") || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("Files", newFiles);
  };

  // Watch message and files for button state
  const messageValue = form.watch("message") || "";
  const filesValue = form.watch("Files") || [];
  const isSendDisabled =
    pending ||
    loading ||
    (!messageValue.trim() &&
      (!Array.isArray(filesValue) || filesValue.length === 0));

  if (!user) {
    console.error(
      "User context is not available. Ensure you are wrapped in UserProvider."
    );
    return null; // or handle the error as needed
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className=""
        autoComplete="off"
      >
        <div
          className={`flex flex-col z-20 items-center border-2 relative dark:bg-input/30 bg-white rounded-lg shadow-md px-[8px] py-[8px] ${
            className ? className : ""
          }`}
        >
          <div className="flex flex-col w-full">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <Textarea
                  {...field}
                  onFocus={handleMobileKeybard}
                  className="resize-none dark:text-base w-[20rem] md:w-[33rem] max-h-[15rem] ring-0 dark:ring-0 border-none bg-transparent dark:bg-transparent text-right"
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  placeholder="اكتب هنا"
                  aria-label="اكتب هنا"
                  rows={2}
                />
              )}
            />
            {(form.watch("Files") ?? []).length > 0 && (
              <div className="flex flex-row flex-wrap gap-2 mt-2 w-full items-end justify-end">
                {(form.watch("Files") ?? [])
                  .filter(
                    (file: File) =>
                      file.type.startsWith("image/") ||
                      file.type === "application/pdf"
                  )
                  .map((file: File, idx: number) => {
                    let icon = (
                      <FileIcon
                        size={20}
                        className="text-red-500"
                        aria-hidden="true"
                      />
                    );
                    if (file.type.startsWith("image/"))
                      icon = (
                        <ImageIcon
                          size={20}
                          className="text-blue-400"
                          aria-hidden="true"
                        />
                      );
                    return (
                      <div
                        key={file.name + String(idx)}
                        className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 shadow-sm max-w-[10rem] min-w-[6rem] relative group transition-all cursor-pointer hover:bg-red-50 hover:border-red-400 hover:shadow-sm hover:shadow-red-300"
                        dir="rtl"
                        onClick={() => handleRemoveFile(idx)}
                        title="اضغط لإزالة الملف"
                      >
                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                          {icon}
                        </div>
                        <span
                          className="truncate block max-w-[5rem] text-xs text-gray-700 dark:text-gray-200 group-hover:text-red-700"
                          title={file.name}
                        >
                          {file.name.length > 16
                            ? `${file.name.slice(0, 16)}...`
                            : file.name}
                        </span>
                        {fileLoading ? (
                          <Clock
                            size={14}
                            className="text-blue-400 animate-spin"
                          />
                        ) : (
                          <span className="opacity-0 group-hover:opacity-100 text-xl text-red-500 font-bold transition-all ml-1 group-hover:text-red-700">
                            x
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
            <div className="flex items-center justify-between w-full mt-2 gap-2">
              <Button
                type="submit"
                disabled={isSendDisabled}
                className="rounded-full"
                variant="default"
                aria-label="Send message"
              >
                {loading ? (
                  <Clock size={20} className="animate-spin" />
                ) : pending ? (
                  <Clock size={20} />
                ) : (
                  <ArrowUp size={20} />
                )}
              </Button>
              <div className="flex flex-col items-end gap-2 w-full">
                <Label
                  htmlFor="chat-file-input"
                  className="cursor-pointer  px-4 py-2 rounded-full text-white hover:bg-black/90 transition-colors flex items-center gap-2 bg-black"
                >
                  <Input
                    id="chat-file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    tabIndex={0}
                    aria-label="Attach file"
                    multiple
                  />
                  ارفق ملف
                </Label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
