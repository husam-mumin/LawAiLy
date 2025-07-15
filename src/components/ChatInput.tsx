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

// Define ChatFile type at top level
export interface ChatFile {
  file: File;
  status: "loading" | "done" | "error";
  text: string;
  id?: string;
}
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useMobileKeybard } from "@/hooks/useKeyboardFix";
import { Image as ImageIcon, File as FileIcon } from "lucide-react";
import { userType } from "@/models/Users";

export const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }).optional(),
  userId: z.string().optional(),
  Files: z.array(z.any()).optional(), // Accept any for ChatFile objects
});
type ChatInputProps = {
  onSend: (message: string, user: string, files: string[]) => Promise<void>;
  loading?: boolean;
  user: userType;
} & ReactProps;

export default function ChatInput({
  onSend,
  className,
  user,
  loading = false,
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
    // Prevent submit if any file is not done
    if (
      Array.isArray(data.Files) &&
      data.Files.some((f: ChatFile) => f.status !== "done")
    ) {
      return;
    }
    // Always send message and file IDs

    const fileIds =
      Array.isArray(data.Files) && data.Files.length > 0
        ? (data.Files as ChatFile[])
            .filter((f) => f.status === "done" && f.id)
            .map((f) => f.id as string)
        : [];
    if (!data.message || data.message.trim().length === 0) {
      return;
    }
    // check files logs
    if (fileIds.length === 0) {
      return;
    }
    if (!loading && !pending) {
      onSend(data.message, user._id, fileIds);
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
  } = useChatFileManager(form);

  // Watch message and files for button state
  const messageValue = form.watch("message") || "";
  // Disable send if any file is loading
  const allFilesDone = filesValue.every(
    (f: ChatFile) => f.status === "done" || f.status === undefined
  );
  const isSendDisabled =
    pending ||
    loading ||
    !allFilesDone ||
    (!messageValue.trim() && !filesValue.length);

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
            {(filesValue ?? []).length > 0 && (
              <div className="flex flex-row flex-wrap gap-2 mt-2 w-full items-end justify-end">
                {(filesValue ?? [])
                  .filter(
                    (fileObj: ChatFile) =>
                      fileObj.file.type.startsWith("image/") ||
                      fileObj.file.type === "application/pdf"
                  )
                  .map((fileObj: ChatFile, idx: number) => {
                    let icon = (
                      <FileIcon
                        size={20}
                        className="text-red-500"
                        aria-hidden="true"
                      />
                    );
                    if (fileObj.file.type.startsWith("image/"))
                      icon = (
                        <ImageIcon
                          size={20}
                          className="text-blue-400"
                          aria-hidden="true"
                        />
                      );
                    return (
                      <div
                        key={fileObj.file.name + String(idx)}
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
                          title={fileObj.file.name}
                        >
                          {fileObj.file.name.length > 16
                            ? `${fileObj.file.name.slice(0, 16)}...`
                            : fileObj.file.name}
                        </span>
                        {fileObj.status === "loading" ? (
                          <Clock
                            size={14}
                            className="text-blue-400 animate-spin"
                          />
                        ) : fileObj.status === "error" ? (
                          <span className="text-red-500 text-xs font-bold ml-1">
                            خطأ
                          </span>
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
import { useUploadFile } from "@/hooks/useUploadFile";

export function useChatFileManager(form: ReturnType<typeof useForm>) {
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useUploadFile();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const MAX_FILES = 2;
    const MAX_SIZE = 5 * 1024 * 1024;

    if (!e.currentTarget.files || e.currentTarget.files.length === 0) return;

    // Get current files
    const currentFiles = form.getValues("Files") || [];
    if (currentFiles.length >= MAX_FILES) {
      setFileError("لا يمكن إرفاق أكثر من ملفين.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Filter valid files
    const filesArray = Array.from(e.currentTarget.files);
    const validFiles = filesArray.filter(
      (file) =>
        (file.type.startsWith("image/") || file.type === "application/pdf") &&
        file.size <= MAX_SIZE
    );

    if (validFiles.length !== filesArray.length) {
      setFileError("فقط الصور وملفات PDF مدعومة وحجم الملف أقل من 5 ميجابايت.");
      return;
    }

    // Prevent duplicates
    const existingNames = new Set(
      (currentFiles as ChatFile[]).map((f) => f.file.name)
    );
    const newFiles = validFiles.filter((file) => !existingNames.has(file.name));
    if (newFiles.length === 0) {
      setFileError("الملفات المحددة مكررة بالفعل.");
      return;
    }

    // Limit total files
    if (currentFiles.length + newFiles.length > MAX_FILES) {
      setFileError("لا يمكن إرفاق أكثر من ملفين.");
      return;
    }

    // Add files with loading status
    const filesWithStatus = [
      ...currentFiles,
      ...newFiles.map((file) => ({
        file,
        status: "loading",
        text: "",
      })),
    ];
    form.setValue("Files", filesWithStatus);

    // Upload each new file
    for (const newFileObj of filesWithStatus.slice(currentFiles.length)) {
      // Set file status to loading (already set above)
      uploadFile(newFileObj.file)
        .then(async (result) => {
          if (!result) throw new Error("Upload failed");
          // Send file URL to OCR API and get text
          let ocrText = "";
          try {
            const ocrRes = await fetch("/api/ocr", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: result.fileUrl }),
            });
            const ocrData = await ocrRes.json();
            ocrText = ocrData.text || "";
          } catch {
            ocrText = "";
          }

          // Send all info to /api/chat/upload to save in DB
          try {
            const dbRes = await fetch("/api/chat/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fileURL: result.fileUrl,
                filename: result.filename,
                filesize: newFileObj.file.size.toString(),
                fileformat: newFileObj.file.type,
                filetext: ocrText,
                message: "", // Pass message id if available
              }),
            });
            const dbData = await dbRes.json();
            // Update file status to done and set id (DB id) and text (OCR text)
            const updatedFiles = (form.getValues("Files") as ChatFile[]).map(
              (f) =>
                f.file.name === newFileObj.file.name && dbData.id
                  ? {
                      ...f,
                      status: "done",
                      text: ocrText,
                      id: dbData.id,
                    }
                  : f
            );
            form.setValue("Files", updatedFiles);
          } catch {
            // Update file status to error
            const updatedFiles = (form.getValues("Files") as ChatFile[]).map(
              (f) =>
                f.file.name === newFileObj.file.name
                  ? { ...f, status: "error", text: "" }
                  : f
            );
            form.setValue("Files", updatedFiles);
            setFileError(
              `حدث خطأ أثناء حفظ الملف في قاعدة البيانات بعد رفعه وقراءة النص: "${newFileObj.file.name}"`
            );
          }
        })
        .catch(() => {
          // Update file status to error
          const updatedFiles = (form.getValues("Files") as ChatFile[]).map(
            (f) =>
              f.file.name === newFileObj.file.name
                ? { ...f, status: "error", text: "" }
                : f
          );
          form.setValue("Files", updatedFiles);
          setFileError(`حدث خطأ أثناء رفع "${newFileObj.file.name}"`);
        });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Remove a file
  const handleRemoveFile = (index: number) => {
    setFileError(null);
    const currentFiles = (form.getValues("Files") as ChatFile[]) || [];
    const newFiles = currentFiles.filter(
      (_: ChatFile, i: number) => i !== index
    );
    form.setValue("Files", newFiles);
  };

  // Watch files
  const filesValue = (form.watch("Files") as ChatFile[]) || [];

  return {
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    filesValue,
    fileError,
    setFileError,
  };
}
