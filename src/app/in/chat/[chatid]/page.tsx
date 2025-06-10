"use client";
import { useParams } from "next/navigation";

import ChatHeader from "./_Components/ChatHeader";

import ChatInput from "@/components/ChatInput";
import { useAddMessage } from "./_hooks/useAddMessage";
import Message from "./_Components/Message";
import Response from "./_Components/Response";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { chatType } from "@/models/Chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useUser } from "@/hooks/useUser";
import { useChatManagement } from "./_hooks/useChatManagement";
/**
 *
 * we must have the Chat message with there responses
 * the order by message Create Time
 * we can accept more then one responses for the message
 * we a delay between the message and get the responses
 * when open the page we must call the getMessageAPI just one time
 * when sent new message we create message in database and return the value to give setChat
 * and check if the message sent successfully or not if not he can resent again
 * after sent we call the response action that run the loading and wait for response for the server
 * response action stop the sent action ( and he can stop the enter proses )  still under the study
 * after the presses end the sent action work again and the response appear
 *
 * when first open
 * # check if is the first open
 * sent loading for sent setting the message
 * sent the message
 *
 * # chat action
 * he can make it favorite chat
 * he can delete the chat
 * he can edit the name of the chat
 *
 * # Message action
 * there are the loading before save
 * he can resent if message don't sent to the server
 * he can edit it
 * he can copy it
 *
 * # Response action
 * there are Loading before the show
 * he can copy it
 *
 * he can recreate new response
 * he review the response
 * he can report for the response
 *
 * @returns s
 */

/**
 * the Sent message process
 * To build a smooth chat interface in Next.js that:
 * 1. Shows the user's message immediately.
 * 2. Shows a "loading" state on that message.
 * 3. Updates the message after it's saved.
 * 4. Shows a response with a loading indicator.
 * 5. Replaces it with the real response after generation.
 *
 */

export default function ChatPage() {
  const params: { chatid: string } = useParams();
  const chatid = params.chatid;
  const user = useUser();

  const {
    chatInputFiles,
    chatInputValue,
    chatFileUploadLoading,
    error,
    handleChatInputChange,
    handleFileInputChange,
  } = useAddMessage();

  const { addNewMessage, chat } = useChatManagement(chatid);
  const [sentLoading, setSentLoading] = useState<boolean>(false);
  const [chatDetail, setChatDetail] = useState<chatType | null>(null);

  const handleSentButton = async () => {
    if (!user) return;
    setSentLoading(true);
    try {
      addNewMessage(chatInputValue, user._id as string);
    } catch (err) {
      // todo handle the error
      console.error(err);
    }
    setSentLoading(false);
  };

  useEffect(() => {
    const getChat = async () => {
      try {
        const response = await axios.get<{ chat: chatType }>(
          `/api/chat/${chatid}`
        );
        const data = response.data;

        setChatDetail(data.chat);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.error(error.message);
        }
      }
    };
    getChat();
  }, [chatid]);

  if (!user) {
    return <div>not auth user</div>;
  }

  return (
    <div>
      <div className="w-screen md:w-180 mx-auto bg-gray-500/5 min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-60px)] relative">
        <>
          {chatDetail ? (
            <ChatHeader
              title={chatDetail.title}
              isFavorite={chatDetail.isFavorite}
              user={user}
            />
          ) : (
            <ChatHeader user={user} title="loading..." isFavorite={false} />
          )}
          {error ? error : ""}
          <ScrollArea className="h-[calc(100vh-133px)] md:h-[calc(100vh-140px)] ">
            <div className="flex flex-col pt-10 px-2">
              <div className="h-70 w-full  mx-auto">
                <div className=" h-full  bg-gary-400">
                  {chat.map((chat) => {
                    if (!chat) return;
                    return (
                      <div key={chat._id} className="mb-10">
                        <div className="ms-auto mb-2">
                          <Message value={chat.text} loading={chat.isLoading} />
                        </div>
                        <div className="ms-auto px-6  text-right">
                          {chat.response ? (
                            <ContextMenu>
                              <ContextMenuTrigger className="bg-amber-300">
                                <Response
                                  value={chat.response.response}
                                  loading={chat.response?.isLoading}
                                />
                              </ContextMenuTrigger>
                              <ContextMenuContent>
                                <ContextMenuItem
                                  onClick={() => {
                                    // todo add to the database are get share it
                                    if (chat.response?.response)
                                      navigator.clipboard.writeText(
                                        chat.response?.response
                                      );
                                  }}
                                >
                                  copy
                                </ContextMenuItem>
                                <ContextMenuItem asChild>
                                  {/**
                                   * // todo add more share platform
                                   * // todo add the share to the database
                                   */}
                                  <a
                                    href={`https://wa.me/?text=${encodeURIComponent(
                                      chat.response?.response || ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    share
                                  </a>
                                </ContextMenuItem>
                                <ContextMenuItem>more</ContextMenuItem>
                              </ContextMenuContent>
                            </ContextMenu>
                          ) : (
                            <Response
                              value="ops something go wrong"
                              loading={true}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="h-[10rem] w-full" />
                </div>
              </div>
            </div>
            <div className="w-full h-full"></div>
            <div className="absolute bottom-4 right-1/2 translate-x-1/2">
              <ChatInput
                value={chatInputValue}
                onChange={handleChatInputChange}
                onSend={handleSentButton}
                onAttachFile={handleFileInputChange}
                attachFile={chatInputFiles}
                loading={sentLoading}
                fileLoading={chatFileUploadLoading}
              />
            </div>
          </ScrollArea>
        </>
      </div>
    </div>
  );
}
