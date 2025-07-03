"use client";
import React, { useEffect, useState } from "react";
import { useChatManager } from "./_hooks/useChatmangaer";
import { useParams, useRouter } from "next/navigation";
import ChatHeader from "./_Components/ChatHeader";
import ChatMessages from "./_Components/ChatMessages";
import { useChatActions } from "../_hook/useChatActions";
import ConfirmDialog from "./_Components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import ChatInput from "@/components/ChatInput";
import { useUser } from "@/app/context/UserContext";
import { useSentAction } from "./_hooks/useSentActon";

/**
 * this is a chat page the happen between customer and LLMs ai that train with law Libyan Laws
 * todo - Add chat page functionality
 * ChatPage component to display chat details and messages.
 * The Page split to sections are
 * 1. Chat Header - Displays chat title (editable by user) and other details.
 * 2. Chat Messages - Displays all messages in the chat.
 * 3. Chat Input - Displays the Input in the bottom
 * 4. handle Loading and Error Statue
 * 5. Auto-Scroll to Latest Message
 * 7. Refresh Button
 * 8. Copy Response: Allow users to copy chat responses easily (important).
 * 9. Share Chat: Provide a way to share the entire chat (important).
 * 10. Share Response: Allow sharing a single response (e.g., via link or social media).
 * 11. User Experience: Ensure smooth and intuitive user experience.
 * 12. Response Review: Allow users to review, are the AI responses good?.
 *
 * Additional suggestions:
 * 11. Accessibility: Ensure input and controls are accessible.
 * 12. Empty State: Show a message if there are no messages yet.
 * 13. Message Timestamps: Display when each message was sent.
 * 14. Optimistic UI: Show messages immediately as user sends them.
 * 15. Error Recovery: Allow retrying failed messages.
 * 16. Mobile Responsiveness: Make sure layout works on mobile.
 * 17. User Avatars: Show who sent each message visually.
 * 18. Scroll Management: Add a scroll-to-bottom button.
 * 19. Loading Placeholders: Use skeletons or spinners.
 * 20. Security: Sanitize message content to prevent XSS.
 *
 * Behaver
 * Loading
 * 1. The Page Loading
 * 2. The get Messages Loading
 * 3. Sent Message Loading
 * 4. get Response Ai Loading
 *
 *
 * Possible Error Messages:
 * 1. Network Error: Failure to fetch or send messages due to connectivity issues.
 * 2. Invalid Chat ID: Chat ID is missing, invalid, or not found.
 * 3. Unauthorized Access: User is not authenticated or lacks permission.
 * 4. API Error: Backend returns an error (500, 404, etc).
 * 5. Message Send Failure: Sending a message fails due to server or validation errors.
 * 6. AI Response Timeout: AI takes too long or fails to respond.
 * 7. Corrupted Data: Received data is malformed or missing fields.
 * 8. Rate Limiting: User sends messages too quickly and is blocked.
 * 9. File Upload Error: File or image attachments fail to upload.
 * 10. XSS/Security Error: Unsanitized content causes a security issue.
 * 11. State Sync Error: UI state is out of sync with backend.
 * 12. Unknown Error: Any unexpected error not covered above.
 *
 * @returns
 */

export default function ChatPage() {
  const { chatid } = useParams();
  const [pageLoading, setPageLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {
    chat,
    messages,
    loading,
    responseLoading,
    error,
    setMessages,
    PostNewResponse,
    refresh,
  } = useChatManager(chatid as string);

  const { user } = useUser();
  const { deleteChat } = useChatActions(chat);
  const router = useRouter();
  const {
    sendMessage,
    sending,
    error: SentingError,
  } = useSentAction(
    chatid as string,
    setMessages,
    PostNewResponse,
    user || { _id: "", email: "", gender: "" }
  );

  useEffect(() => {
    if (!loading && chat) {
      setPageLoading(false);
    }
  }, [loading, chat]);
  useEffect(() => {
    console.log("Open Delete Dialog:", openDeleteDialog);
  }, [openDeleteDialog]);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-12 w-12 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <div className="text-2xl font-bold text-gray-700 animate-pulse">
            جاري تحميل الصفحة...
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-12 w-12 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <div className="text-2xl font-bold text-gray-700 animate-pulse">
            جاري التحميل...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center flex-col justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="flex flex-col items-center gap-4 p-8 bg-white/80 rounded-xl shadow-lg border border-red-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-16 w-16 text-red-500 mb-2 "
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-20"
            />
            <path
              fill="currentColor"
              d="M12 8v4m0 4h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-red-600 text-2xl font-bold text-center">
            حدث خطأ أثناء تحميل المحادثة
            <br />
            يرجى المحاولة مرة أخرى لاحقًا.
          </div>
          <Button
            variant={"secondary"}
            onClick={() => router.push("/in")}
            className="mt-4"
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const handlerDeleteChat = async () => {
    const res = await deleteChat();
    if (res !== false) {
      router.push("/in");
    }
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <div>
        <div className="flex flex-col min-w-full">
          <div className="w-full md:w-[36rem] mx-auto">
            <ChatHeader
              setDeleteDialog={setOpenDeleteDialog}
              chat={chat}
              loading={loading}
              refresh={refresh}
            />
          </div>
          <ChatMessages
            sendingError={SentingError}
            Messages={messages}
            responseLoading={responseLoading}
          />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
            <ChatInput
              onSend={async (
                message: string,
                userId: string,
                flies?: File[] | null
              ) => {
                await sendMessage(message, flies);
              }}
              loading={sending}
              user={user || { _id: "", email: "", gender: "" }}
            />
          </div>
        </div>
      </div>
      <ConfirmDialog
        deleteChat={handlerDeleteChat}
        openDialog={openDeleteDialog}
        setOpenDialog={setOpenDeleteDialog}
      />
    </>
  );
}
