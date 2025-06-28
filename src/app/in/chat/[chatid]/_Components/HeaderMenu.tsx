import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type HeaderMenuProps = {
  chatid: string;
};

export default function HeaderMenu({ chatid }: HeaderMenuProps) {
  const router = useRouter();
  async function handleDelate() {
    // Handle delete action here
    const response = await axios.delete(`/api/chat/${chatid}`);
    if (response.status !== 200) {
      console.error("Failed to delete chat");
      return;
    }
    // Redirect to the chat list or another page
    router.replace("/in");
  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2">
          <Button variant={"ghost"}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <span className="text-sm">Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="text-sm">Report</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Dialog>
              <DialogTrigger
                className="
              focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
              text-sm text-red-600 w-full"
              >
                <span className="text-sm text-red-600">Delete</span>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Delete Chat</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this chat? This action cannot
                  be undone.
                </DialogDescription>
                <div className="mt-4 flex justify-end">
                  <DialogClose>
                    <Button
                      variant="secondary"
                      className="me-2"
                      onClick={() => console.log("Cancel")}
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button variant="destructive" onClick={() => handleDelate()}>
                    Confirm
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="text-sm">Edit Name</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
