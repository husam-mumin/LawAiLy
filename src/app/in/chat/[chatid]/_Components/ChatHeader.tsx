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
import Link from "next/link";

type ChatHeaderProps = {
  chat: chatType | null;
  loading?: boolean;
  setDeleteDialog: (e: boolean) => void;
  refresh: () => void;
  openDeleteButtonRef?: React.Ref<HTMLButtonElement>;
  dropdownOpen?: boolean;
  setDropdownOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

type ChatTitleProps = {
  title?: string;
  loading?: boolean;
  editTitle: boolean;
  setEditTitle: (e: boolean) => void;
  chat: chatType;
  isGuest?: boolean;
  renameChat: (e: string) => void;
  handleFavirate: (e: boolean) => void;
  isFavorite: boolean;
};
// This component is used to display the title of the chat.
// It can be used to display the chat title or a default title if the chat has no
function ChatTitle({
  title,
  loading = false,
  isGuest,
  editTitle,
  setEditTitle,
  chat,
  renameChat,
  handleFavirate,
  isFavorite,
}: ChatTitleProps) {
  const [oldTitle, setOldTitle] = useState(title);
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
      }, 254);
    }
  }, [editTitle, inputRef]);

  const handleTitleChange = () => {
    setTimeout(async () => {
      if (!editTitle) return; // If not in edit mode, do nothing
      if (!inputRef.current) return; // If inputRef is not set, do nothing

      if (newTitle && newTitle.trim() !== oldTitle?.trim()) {
        renameChat(newTitle);

        setEditTitle(false);
        setOldTitle(newTitle);
      }
      setEditTitle(false);
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
            handleTitleChange();
          }, 220);
        }}
        dir="rtl"
        className={`text-2xl font-bold text-gray-800 border-none 
          ${!editTitle ? "focus-visible::outline-0 focus-visible:ring-0" : ""}
          shadow-none disabled:opacity-100`}
      />
      {/* Favorite Star Icon */}
      <Button
        type="button"
        onClick={() => {
          handleFavirate(isFavorite);
        }}
        variant={"ghost"}
        disabled={!loading || !isGuest}
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
  isGuest?: boolean;
  isFavrite: boolean;
  setOpenDailog: (e: boolean) => void;
  copyLink: () => void;
  shareChat: () => string;
  refresh: () => void;
  triggerRef?: React.Ref<HTMLButtonElement>; // <-- new prop
};
function ChatDropDowmMenu({
  setEditTitle,
  handleFavrite,
  isGuest,
  isFavrite,
  setOpenDailog,
  copyLink,
  shareChat,
  refresh,
  triggerRef, // <-- new prop
  dropdownOpen,
  setDropdownOpen,
}: ChatDropDownMenuProps & {
  triggerRef?: React.Ref<HTMLButtonElement>;
  dropdownOpen?: boolean;
  setDropdownOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex items-center ">
      <DropdownMenu
        dir="rtl"
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} ref={triggerRef}>
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
            disabled={isGuest}
            onClick={() => {
              setTimeout(() => {
                setEditTitle(true);
              }, 50);
            }}
          >
            <Pencil className="h-4 w-4 ml-2" /> تعديل العنوان
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isGuest} onClick={() => shareChat()}>
            <Share2 className="h-4 w-4 ml-2" /> مشاركة المحادثة
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isGuest}
            className="text-red-600 focus:bg-red-50"
            style={{ color: "#dc2626" }}
            onClick={() => {
              if (setDropdownOpen) setDropdownOpen(false);
              setTimeout(() => setOpenDailog(true), 50);
            }}
          >
            <Trash2 className="h-4 w-4 ml-2 text-red-600" /> حذف المحادثة
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isGuest} onClick={() => copyLink()}>
            <Link2 className="h-4 w-4 ml-2" /> نسخ رابط المحادثة
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isGuest}
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
      <Link href={"/in/chat"}>
        <Button className="h-8">بداء محدثة جديدة</Button>
      </Link>
    </div>
  );
}

export default function ChatHeader({
  chat,
  loading,
  setDeleteDialog,
  refresh,
  openDeleteButtonRef,
  dropdownOpen,
  setDropdownOpen,
}: ChatHeaderProps) {
  const [editHeader, setEditHeader] = useState(false);
  const [isFavorite, setIsFavorite] = useState(chat?.isFavorite ?? false);
  const { renameChat, toggleFavorite, copyLink, shareChat } =
    useHeaderAction(chat);
  const [isGuest, setIsGuest] = useState(false);

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

  useEffect(() => {
    const Guest_id = localStorage.getItem("guest_id");
    if (Guest_id) {
      setIsGuest(true);
    } else {
      setIsGuest(false);
    }
  }, []);

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white rounded-lg mb-4">
        <ChatDropDowmMenu
          isFavrite={isFavorite}
          setEditTitle={setEditHeader}
          handleFavrite={handleFavirate}
          setOpenDailog={(e) => setDeleteDialog(e)}
          isGuest={isGuest}
          copyLink={copyLink}
          shareChat={shareChat}
          refresh={handleRefresh}
          triggerRef={openDeleteButtonRef}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
        />

        <ChatTitle
          editTitle={editHeader}
          handleFavirate={handleFavirate}
          isFavorite={isFavorite}
          renameChat={renameChat}
          isGuest={isGuest}
          title={chat?.title}
          loading={loading}
          setEditTitle={setEditHeader}
          chat={chat ? chat : ({ _id: "", title: "" } as chatType)}
        />
      </div>
    </>
  );
}
