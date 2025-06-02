import { useEffect, useState } from "react";
import { sentMessage } from "../_action/sentMessage";
import { getAllChatMessages } from "../_action/getAllChatMessages";
import { responseType } from "@/models/Responses";
import { sentResponse } from "../_action/sentResponse";
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

export function useChatMangement(chatid: string) {

  const [chat, setChat] = useState<chats>([])
  
  async function usentResponse(message: string, messageid: string){
    
    
    const aiResponse = await sentResponse(message, messageid, chatid) 
    
    if(!aiResponse) return

    setChat((prev)=> {
      const newArray = prev.map(chat => {
        if(chat._id !== messageid) return chat
        console.log("chat",chat);
        console.log("airepsonse" ,aiResponse);
        
        return {
          text: message,
          _id: messageid,
          isLoading: false,
          response: {
            chat: aiResponse.chat,
            isGood: aiResponse.isGood,
            isLoading: false,
            message: aiResponse.message,
            response: aiResponse.response 
          }
        }

      })
      return [...newArray]
    })
    
    

  }
  async function addNewMessage(message: string, userid: string){ 
    const newMessage: messageType= {
      _id: "200",
      isLoading: true,
      text: message,
      response: {
        chat: chatid,
        isGood: null,
        isLoading: true,
        message: '200',
        response: ''
      }
      } 

    setChat((prev)=> ([...prev, newMessage]))

    const data = await sentMessage(message, chatid, userid)
    if(!data) return;
    
    setChat((prev)=> {
      const newArray = prev.map(chat => {
        if(chat._id !== "200") return chat
        return {
          text: data.message,
          _id: data._id,
          isLoading: false,
          response: {
            chat: chatid,
            isGood: null,
            isLoading: false,
            message: data._id,
            response: 'is loading'
          }
        }

      })
      return [...newArray]
    })
    
    await usentResponse(data.message, data._id) 
    
    
    


  }

  // when you open the chat
  useEffect(()=> {
    
    const getData = async ()=> {
      const da = await getAllChatMessages(chatid);
      
      const data = da.chat
      const newData: chats =  []
      
        console.log("before whatis :", da);
        console.log("before whatis chat:", newData);
        
      data.forEach((m)=> {
        newData.push(
          {text: m.message, _id: m._id, isLoading: false, response: 
            {  chat: chatid,
              isGood: null,
              message: m.message,
              response: m.response ? m.response.response : '',
              isLoading: false}}
        )
      })
      setChat(newData)
        console.log("what is this", newData[0]);
      if(!newData[0].response?.response) {
        
        await usentResponse(newData[0].text, newData[0]._id as string)
      }
    }
    getData()
  }, [])

  return {chat, addNewMessage}

}