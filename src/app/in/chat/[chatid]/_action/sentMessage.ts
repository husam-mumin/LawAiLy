import { messageType } from "@/models/Messages"
import axios, { AxiosError } from "axios"

export async function sentMessage(message: string, chatid: string, user: string) {

    const sentData = {
      mes: message,
      userid: user
    }

    try {
      const response = await axios.post<messageType>(`/api/chat/${chatid}/messages`, sentData)
      return  response.data
    } catch (err: unknown) {
      // todo complete this catch
      console.error("Login error:", err);
      // Handle login error (e.g., show error message)
      if (err instanceof AxiosError) {
        if (err.status === 401) {
          console.error(err.message);
          
        }
      }
    }
}