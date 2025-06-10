// import { messageResponse } from "@/app/api/chat/[chatid]/route";

import { messageType } from "@/models/Messages";
import axios from "axios";

export async function getAllChatMessages(chatid : string){
  
  const response = await axios.get<{chat: messageType[]}>(`/api/chat/${chatid}/messages`)

  
  const data = response.data
  
  return data;
};
