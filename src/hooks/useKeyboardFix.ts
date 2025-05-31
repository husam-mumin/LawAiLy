import { FocusEvent } from "react";
import {  useIsMobile } from "./use-mobile";

export function useMobileKeybard() { 
  const isMobile = useIsMobile()

    function handleMobileKeybard(e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>)  {
      if(!isMobile) return
      setTimeout(()=> {
        
        e.target.scrollIntoView({behavior: "smooth", block: 'start'})
      }, 200)
    } 
  return { handleMobileKeybard }
}