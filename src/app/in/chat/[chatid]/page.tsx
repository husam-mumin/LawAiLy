"use client";
import { useParams } from "next/navigation";

import React from "react";
import { useChatMangement } from "./_hooks/useChatMangement";
/**
 * we must have the Chat message with there responses
 * the order by message Create Time 
 * we can accept more then one responses for the message 
 * we a delay between the message and get the responses 
 * when open the page we must call the getMessageAPI just one time 
 * when sent new message we create message in database and return the value to give setChat 
 * and check if the message sent successfully or not if not he can resent again 
 * after sent we call the response action that run the loading and wait for response for the server 
 * response action stop the sent action ( and he can stop the enter proses )  still under the study
 * @returns s
 */

export default function Chat() {
  const params: { chatid: string } = useParams();
  const chatid = params.chatid as string;
  const { chat, firstchatLoading, messages } = useChatMangement(chatid);

  return (<div></div>)
  return (
    <div>
      <div className="w-screen md:w-180 mx-auto bg-gray-500/5 h-[calc(100vh-120px)] md:h-[calc(100vh-60px)] relative">
        {firstchatLoading ? (
          <div className="flex justify-center items-center">Loading...</div>
        ) : (
          <>
            <div className="w-full flex justify-center items-center mx-auto text-2xl font-bold py-2 bg-gray-100">
              {chat. || "untitle"}
              <Button variant={"ghost"} onClick={handleFavireButton}>
                {!chatfa ? <Heart /> : <Heart className="fill-red-400" />}
              </Button>
            </div>
            <div className="flex flex-col pt-10 px-2">
              {firstchatLoading ? (
                <div className="flex justify-center items-center">
                  Loading...
                </div>
              ) : (
                messages &&
                messages.map((message) => {
                  console.log(message);

                  return (
                    <div key={message._id}>
                      <Message value={message.message} />
                      <Response
                        value={
                          message.responses.length > 0
                            ? message.responses[0].response
                            : ""
                        }
                        loading={message.responses[0] ? false : true}
                      />
                    </div>
                  );
                })
              )}
              <div className="h-70 w-full " />
              <div className="absolute bottom-4 right-1/2 translate-x-1/2">
                <ChatInput
                  value={chatInputValue}
                  onChange={handleChatInputChange}
                  onSend={handleChatInputSend}
                  onAttachFile={handleFileUpload}
                  attachFile={chatInputFiles}
                  loading={chatsendLoading}
                  fileLoading={chatfileUploadLoading}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
