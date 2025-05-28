import { messageResponse } from "@/app/api/chat/[chatid]/route";

export async function getAllChatMessages(chatid : string){
  
      const response = await fetch(`/api/chat/${chatid}`);

      if (!response.ok) {
        throw new Error("can't fetch the chat data");
      }
      const messages: messageResponse[] = await response.json();
      if(!messages || messages.length == 0){
        throw new Error("there are no messages")
      }

      return messages;
    };
