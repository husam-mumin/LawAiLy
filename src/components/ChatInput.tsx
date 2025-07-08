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

  // Custom hook for file management and error handling
  const {
    fileInputRef: fileInputRefCustom,
    handleFileChange,
    handleRemoveFile,
    filesValue,
    fileError,
  } = useChatFileManager(form, fileLoading);

  // Watch message and files for button state
  const messageValue = form.watch("message") || "";
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
                  maxLength={500}
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
            {/* Error message for file upload */}
            {fileError && (
              <div className="text-right text-sm text-red-600 mt-2 font-bold">
                {fileError}
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
              <div dir="rtl" className="flex ">
                <Label
                  htmlFor="chat-file-input"
                  className="cursor-pointer px-4 py-2 rounded-full text-white hover:bg-black/90 transition-colors flex items-center gap-2 bg-black w-max"
                >
                  <span className="flex items-center gap-2">
                    <FileIcon size={18} className="text-white" />
                    <span dir="rtl" className="flex w-max">
                      ارفق ملف
                    </span>
                  </span>
                  <Input
                    id="chat-file-input"
                    ref={fileInputRefCustom}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    tabIndex={0}
                    aria-label="Attach file"
                    multiple
                  />
                </Label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

// Custom hook for file management and error handling
import { useState } from "react";

export function useChatFileManager(
  form: ReturnType<typeof useForm>,
  fileLoading: boolean = false
) {
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file attach and reset input
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      if (form.getValues("Files").length > 2) {
        setFileError("لا يمكن إرفاق أكثر من ملفين.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const filesArray = Array.from(e.currentTarget.files);
      // Only allow images and PDFs
      const validFiles = filesArray.filter(
        (file) =>
          file.type.startsWith("image/") || file.type === "application/pdf"
      );
      if (validFiles.length !== filesArray.length) {
        setFileError("فقط الصور وملفات PDF مدعومة.");
      }

      if (validFiles.length === 0) {
        setFileError("يرجى إرفاق ملف صحيح.");
        return;
      }
      if (form.getValues("Files").length + validFiles.length > 2) {
        setFileError("لا يمكن إرفاق أكثر من ملفين.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (validFiles.length > 2) {
        setFileError("لا يمكن إرفاق أكثر من ملفين.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (fileLoading) {
        setFileError("جاري تحميل الملفات، يرجى الانتظار.");
        return;
      }
      // Add valid files to the form state
      if (!form.getValues("Files")) {
        form.setValue("Files", []);
      }

      // Ensure we don't duplicate files
      const existingFiles = form.getValues("Files") || [];
      const existingFileNames = new Set(
        existingFiles.map((file: File) => file.name)
      );
      const newFiles = validFiles.filter(
        (file) => !existingFileNames.has(file.name)
      );

      if (newFiles.length === 0) {
        setFileError("الملفات المحددة مكررة بالفعل.");
        return;
      }
      // Update the form with new files
      const updatingFiles = [...existingFiles, ...newFiles];

      form.setValue("Files", updatingFiles);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // now use the api to upload files and handle errors
      // const response = await axios.post("/api/chat/upload", {
      //   files: newFiles,
      // });

      // if (response.status !== 200) {
      //   setFileError("حدث خطأ أثناء تحميل الملفات.");
      //   return;
      // }
      // // Successfully uploaded files, update form state
      // const updatedFiles = response.data.files || [];

      // form.setValue("Files", [...existingFiles, ...updatedFiles]);
      // form.setValue("Files", updatedFiles);
      // console.log("Files uploaded successfully:", response.data);
    }
  };

  // Remove a file from the attached files list
  const handleRemoveFile = (index: number) => {
    setFileError(null);
    const currentFiles = form.getValues("Files") || [];
    const newFiles = currentFiles.filter((_: File, i: number) => i !== index);
    form.setValue("Files", newFiles);
  };

  // Watch files
  const filesValue = form.watch("Files") || [];

  return {
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    filesValue,
    fileError,
    setFileError,
  };
}
