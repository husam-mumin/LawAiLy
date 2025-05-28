import { useEffect, useState } from "react";
import { getAllChatMessages } from "../_action/getAllChatMessages";
import { messageResponse } from "@/app/api/chat/[chatid]/route";

/**
 * get all chat form first Enter or when Change the page
 */

export function useChatMangement(chatid : string) {

  const [chat, setChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<messageResponse[] | null>();
  const [firstchatLoading, setFirstChatLoading] = useState(false);

  useEffect(()=> {
    const getdata = async ()=> {
      setFirstChatLoading(true)

    const messages = await getAllChatMessages(chatid)
    setMessages(messages);
    setFirstChatLoading(false);
    } 
    getdata()
  }, [chatid])

  return {messages, chat, firstchatLoading, setMessages, setChat, setFirstChatLoading}
}