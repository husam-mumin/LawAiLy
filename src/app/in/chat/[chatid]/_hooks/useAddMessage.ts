import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";


/**
 * loading 
 * message
 * error
 */
export function useAddMessage(){
  const [chatInputValue, setChatInputValue] = useState<string>("");
  const [chatInputFiles, setChatInputFiles] = useState<File | null>(null);
  const [chatsendLoading, setChatSendLoading] = useState<boolean>(false);
  const [chatfileUploadLoading, setChatFileUploadLoading] =
    useState<boolean>(false);
  const [error , setError] = useState<string | null>(null)
  const user = useUser();
  const router = useRouter()

  const handleChatInputChange = (value: string)=>{
    
    
    setChatInputValue(value)
  }

  const handleSentButton = async ()=> {
    try {

    if(!chatInputValue.trim()) return;
    setError(null)
    setChatSendLoading(true)


    if (!user) {
      setError("unauth User")
      return;
    }
    const data = {
      
        message: chatInputValue,
        attachFile: chatInputFiles,
        userId: user._id,
        title: 'unTitle',
    }

    const response = await axios.post('/api/chat', data)

    if( response.status == 201 ) {
      setChatSendLoading(false)
      router.push(`/in/chat/${response.data.chatId}`)
    } 

    } catch (err : unknown) {
      setChatSendLoading(false)
      if (err instanceof AxiosError) {
        console.error(err.message);
        
      }
      console.error(err);
      
    }
    // todo handle the errors
  }
  const handleFileInputChange = async (file: File)=> {
    /**
     * first we check the file if support it 
     * second 
     */
    try {
      setChatFileUploadLoading(true)
      await isSupport(file)

    // todo we need to upload it to the google drive then ocr or we need 

    setChatInputFiles(file)
    setChatFileUploadLoading(false)

    } catch (error) {
      setChatFileUploadLoading(false)
      console.error(error);
      
    }

  }

  

  return {
    chatfileUploadLoading, 
    chatsendLoading,
    chatInputFiles, 
    chatInputValue,
    handleFileInputChange, 
    handleChatInputChange,
    error,
    handleSentButton
    }

}

async function isSupport(file: File) {

    const supportFormat = ['image/png', 'image/jpg', 'image/gif', 'application/pdf']
    let isSupported = true;


    // check for the format of the file if support or not 
    for (let index = 0; index < supportFormat.length; index++) {
      if(supportFormat[index] == file.type){
        isSupported = true
        break;
      }
      isSupported = false;
    }

    if(!isSupported){
      throw new Error("File Format is not support it")
    }

    const FileSize = file.size / 1000000; // convert byte to Megabyte


    if(FileSize > 1){
      isSupported = false;
    }


    if(!isSupported){
      throw new Error("File are bigger then 1MB")
    }

    // check for pdf pages count
    // ! untest it must try it 

    //   const pdfPageCount = async ()=>{
    //     const reader = new FileReader();
    //     let b64 = ''
    //      reader.onloadend = function () {
    //       if(!reader != null  || !reader.result ) return
    // // Since it contains the Data URI, we should remove the prefix and keep only Base64 string
    //         b64 = reader.result.toString().replace(/^data:.+;base64,/, '')
    //      }
    //      reader.readAsDataURL(file)
    //     const pageCount = pdf.numPages
    //     return pageCount
    //   }

    
    // if(file.type == 'application/pdf' ){
    //   const pageCount = await pdfPageCount();
    //   if(pageCount > 3){
    //     throw new Error("pdf must be less then 3 pages")
    //   }
    // }

}