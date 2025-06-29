import { useCallback, useEffect, useState } from "react";
import { sentMessage } from "../_action/sentMessage";
import { getAllChatMessages } from "../_action/getAllChatMessages";
import { responseType } from "@/models/Responses";
import { sentResponse as sentResponseOut } from "../_action/sentResponse";
// import { messageResponse } from "@/app/api/chat/[chatid]/route";

/**
 * get all chat form first Enter or when Change the page
 */

export type messageType = {
  _id?: string,
  text: string,
  isLoading?: boolean;
  response?: responseType & {isLoading: boolean},
  createAt?: Date,
}

export type chats = messageType[]

export function useChatManagement(chatId: string) {

  const [chat, setChat] = useState<chats>([])

  const sentResponse = useCallback(
    async (message: string, messageid: string) => {
      const aiResponse = await sentResponseOut(message, messageid, chatId);

      if (!aiResponse) return;

      setChat((prev) => {
        const newArray = prev.map(chat => {
          if (chat._id !== messageid) return chat;

          return {
            text: message,
            _id: messageid,
            isLoading: false,
            response: {
              ...aiResponse,
              isLoading: false
            }
          }
        });
        return [...newArray];
      });
    },
    [chatId]
  );
  async function addNewMessage(message: string, userid: string){ 
    const newMessage: messageType= {
      _id: "200",
      isLoading: true,
      text: message,
      response: {
        chat: chatId,
        isGood: null,
        isLoading: true,
        message: '200',
        response: ''
      }
      } 

    setChat((prev)=> ([...prev, newMessage]))

    const data = await sentMessage(message, chatId, userid)
    if(!data) return;
    
    setChat((prev)=> {
      const newArray = prev.map(chat => {
        if(chat._id !== "200") return chat
        return {
          text: data.message,
          _id: data._id,
          isLoading: false,
          response: {
            chat: chatId,
            isGood: null,
            isLoading: false,
            message: data._id,
            response: 'is loading'
          }
        }

      })
      return [...newArray]
    })
    
    await sentResponse(data.message, data._id) 
    
    
    


  }

  // when you open the chat
  useEffect(()=> {
    
    const getData = async ()=> {
      const da = await getAllChatMessages(chatId);
      
      const data = da.chat
      const newData: chats =  []
      
        
      data.forEach((m)=> {
        newData.push(
          {text: m.message, _id: m._id, isLoading: false, response: 
            {  chat: chatId,
              isGood: null,
              message: m.message,
              response: m.response ? m.response.response : '',
              isLoading: false}}
        )
      })
      setChat(newData)
      if(!newData[0].response?.response) {
        
        await sentResponse(newData[0].text, newData[0]._id as string)
      }
    }
    getData()
  }, [chatId, sentResponse])

  return {chat, addNewMessage}

}