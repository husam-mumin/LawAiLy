import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactProps from "@/Types/ReactProps";
import React from "react";

type newsProps = {} & ReactProps;

export default function News({ className }: newsProps) {
  return (
    <div>
      <Dialog>
        <DialogTrigger
          className={`w-75 h-18 bg-blue-500 text-white flex justify-center items-center rounded-md cursor-pointer hover:bg-blue-600 transition-colors ${
            className ? className : ""
          }`}
        >
          <div className="flex justify-center items-center">News</div>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>
            here where you can find the latest news and updates.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
