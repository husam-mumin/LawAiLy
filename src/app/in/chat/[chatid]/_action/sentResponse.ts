import { responseType } from "@/models/Responses"
import axios, { AxiosError } from "axios"

export async function sentResponse(message: string, messageid: string, chatid: string){
  try {

  const sentdata = {
    message: message,
    messageid: messageid,
    chat: chatid
  }

  const respnose = await axios.post<{ responseDoc :responseType}>('/api/chat/response', sentdata)
  const data = respnose.data.responseDoc

  return data
  } catch ( error: unknown){
    if(error instanceof AxiosError){
      console.error(error.message);
    }
    console.error(error);
    
  }
}