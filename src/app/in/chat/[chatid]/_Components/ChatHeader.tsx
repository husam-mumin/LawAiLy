import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { chatType } from "@/models/Chat";
import {
  EllipsisVertical,
  Pencil,
  Share2,
  Trash2,
  Link2,
  Star as StarFilled,
  RefreshCcw,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useHeaderAction } from "../../_hook/useHeaderAction";

type ChatHeaderProps = {
  chat: chatType | null;
  loading?: boolean;
  setDeleteDialog: (e: boolean) => void;
  refresh: () => void;
};

type ChatTitleProps = {
  title?: string;
  loading?: boolean;
  editTitle: boolean;
  setEditTitle: (e: boolean) => void;
  chat: chatType;
  renameChat: (e: string) => void;
  handleFavirate: (e: boolean) => void;
  isFavorite: boolean;
};
// This component is used to display the title of the chat.
// It can be used to display the chat title or a default title if the chat has no
function ChatTitle({
  title,
  loading = false,
  editTitle,
  setEditTitle,
  chat,
  renameChat,
  handleFavirate,
  isFavorite,
}: ChatTitleProps) {
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNewTitle(title);
  }, [title, chat.isFavorite]);

  useEffect(() => {
    if (editTitle && inputRef.current) {
      // Focus after a short delay to ensure input is enabled and rendered
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
        if (inputRef.current) inputRef.current.select();
      }, 100);
    }
  }, [editTitle, inputRef]);

  const handleTitleChange = () => {
    setTimeout(async () => {
      if (!editTitle) return; // If not in edit mode, do nothing
      if (!inputRef.current) return; // If inputRef is not set, do nothing

      if (newTitle && newTitle.trim() !== title) {
        renameChat(newTitle);
        setEditTitle(false);
      }
    }, 150);
  };

  if (loading) return <div>Loading</div>;

  return (
    <div className="flex items-center justify-center">
      <Input
        ref={inputRef}
        disabled={!editTitle || loading}
        value={loading ? "جاري جلب عنون" : newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onBlur={() => {
          setTimeout(() => {
            if (!inputRef.current?.onfocus) handleTitleChange();
          }, 120);
        }}
        dir="rtl"
        className={`text-2xl font-bold text-gray-800 border-none 
          ${!editTitle ? "focus-visible::outline-0 focus-visible:ring-0" : ""}
          shadow-none disabled:opacity-100`}
      />
      {/* Favorite Star Icon */}
      <Button
        type="button"
        onClick={() => handleFavirate(isFavorite)}
        variant={"ghost"}
        title={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        className=" focus:outline-none"
        style={{ background: "none", border: "none", padding: 0 }}
      >
        {isFavorite ? (
          <StarFilled
            className="size-5 my-auto text-yellow-400 fill-yellow-400"
            fill="currentColor"
          />
        ) : (
          <StarFilled className="size-5 my-auto text-gray-400" />
        )}
      </Button>
    </div>
  );
}

// here we can add a dropdown menu for chat options
// such as rename, delete, share, etc.
type ChatDropDownMenuProps = {
  setEditTitle: (value: boolean) => void;
  handleFavrite: (e: boolean) => void;
  isFavrite: boolean;
  setOpenDailog: (e: boolean) => void;
  copyLink: () => void;
  shareChat: () => string;
  refresh: () => void;
};
function ChatDropDowmMenu({
  setEditTitle,
  handleFavrite,
  isFavrite,
  setOpenDailog,
  copyLink,
  shareChat,
  refresh,
}: ChatDropDownMenuProps) {
  return (
    <>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              refresh();
            }}
            className="text-blue-600 focus:bg-blue-50"
            style={{ color: "#2563eb" }}
          >
            <RefreshCcw className="h-4 w-4 ml-2" /> تحديث المحادثة
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => {
                setEditTitle(true);
              }, 50);
            }}
          >
            <Pencil className="h-4 w-4 ml-2" /> تعديل العنوان
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareChat()}>
            <Share2 className="h-4 w-4 ml-2" /> مشاركة المحادثة
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:bg-red-50"
            style={{ color: "#dc2626" }}
            // ! This is a custom dropdown item open dialog but broke the application buttons after close the dialog
            onClick={() => setOpenDailog(true)}
          >
            <Trash2 className="h-4 w-4 ml-2 text-red-600" /> حذف المحادثة
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copyLink()}>
            <Link2 className="h-4 w-4 ml-2" /> نسخ رابط المحادثة
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleFavrite(isFavrite);
            }}
          >
            <StarFilled
              className={`h-4 w-4 ml-2 ${
                isFavrite ? "text-yellow-400 fill-yellow-400" : ""
              }`}
            />{" "}
            إضافة إلى المفضلة
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default function ChatHeader({
  chat,
  loading,
  setDeleteDialog,
  refresh,
}: ChatHeaderProps) {
  const [editHeader, setEditHeader] = useState(false);
  const [isFavorite, setIsFavorite] = useState(chat?.isFavorite ?? false);
  const { renameChat, toggleFavorite, copyLink, shareChat } =
    useHeaderAction(chat);

  const handleFavirate = async () => {
    const isFavrite = await toggleFavorite(isFavorite);
    if (isFavrite == undefined) return;
    setIsFavorite(isFavrite);
  };

  function handleRefresh() {
    if (refresh) {
      refresh();
    }
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white rounded-lg mb-4">
        <ChatDropDowmMenu
          isFavrite={isFavorite}
          setEditTitle={setEditHeader}
          handleFavrite={handleFavirate}
          setOpenDailog={(e) => setDeleteDialog(e)}
          copyLink={copyLink}
          shareChat={shareChat}
          refresh={handleRefresh}
        />
        <ChatTitle
          editTitle={editHeader}
          handleFavirate={handleFavirate}
          isFavorite={isFavorite}
          renameChat={renameChat}
          title={chat?.title}
          loading={loading}
          setEditTitle={setEditHeader}
          chat={chat ? chat : ({ _id: "", title: "" } as chatType)}
        />
      </div>
    </>
  );
}
