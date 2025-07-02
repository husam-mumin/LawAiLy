"use client";
import React from "react";
import { useChatManager } from "./_hooks/useChatmangaer";
import { useParams } from "next/navigation";

/**
 * this is a chat page the happen between customer and LLMs ai that train with law Libyan Laws
 * todo - Add chat page functionality
 * ChatPage component to display chat details and messages.
 * The Page split to sections are
 * 1. Chat Header - Displays chat title and other details.
 * 2. Chat Messages - Displays all messages in the chat.
 * 3. Chat Input - Displays the Input in the bottom
 * 4. handle Loading and Error Statue
 * 5. Auto-Scroll to Latest Message
 * 7. Refresh Button
 *
 * Additional suggestions:
 * 8. Accessibility: Ensure input and controls are accessible.
 * 9. Empty State: Show a message if there are no messages yet.
 * 10. Message Timestamps: Display when each message was sent.
 * 11. Optimistic UI: Show messages immediately as user sends them.
 * 12. Error Recovery: Allow retrying failed messages.
 * 13. Mobile Responsiveness: Make sure layout works on mobile.
 * 14. User Avatars: Show who sent each message visually.
 * 15. Scroll Management: Add a scroll-to-bottom button.
 * 16. Loading Placeholders: Use skeletons or spinners.
 * 17. Security: Sanitize message content to prevent XSS.
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
  console.log("Chat ID:", chatid);

  const { chat, messages, loading, error, refresh } = useChatManager(
    chatid as string
  );

  return (
    <div>
      <div></div>
    </div>
  );
}
