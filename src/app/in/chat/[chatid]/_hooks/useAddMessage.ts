import { useState } from "react";
import pdfjs from 'pdfjs-dist'

/**
 * loading 
 * message
 * 
 */
export function useAddMessage(){
  const [chatInputValue, setChatInputValue] = useState<string>("");
  const [chatInputFiles, setChatInputFiles] = useState<File | null>(null);
  const [chatsendLoading, setChatSendLoading] = useState<boolean>(false);
  const [chatfileUploadLoading, setChatFileUploadLoading] =
    useState<boolean>(false);

  const handleChatInputChange = (value: string)=>{
    
    // remove all space for start and the end and check if empty or not
    value = value.trim()
    if(!value) return

    // we Can add some modification in the value
    
    setChatInputValue(value)
  }

  const handleSentButton = ()=> {
    setChatSendLoading(true)

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

      const pdfPageCount = async ()=>{
        const reader = new FileReader();
        let b64 = ''
         reader.onloadend = function () {
          if(!reader != null  || !reader.result ) return
    // Since it contains the Data URI, we should remove the prefix and keep only Base64 string
            b64 = reader.result.toString().replace(/^data:.+;base64,/, '')
         }
         reader.readAsDataURL(file)
        const pdf = await pdfjs.getDocument({data: b64}).promise
        const pageCount = pdf.numPages
        return pageCount
      }

    
    if(file.type == 'application/pdf' ){
      const pageCount = await pdfPageCount();
      if(pageCount > 3){
        throw new Error("pdf must be less then 3 pages")
      }
    }

}