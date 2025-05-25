import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export default function DocumentCard() {
  return (
    <Card className="cursor-pointer w-75 h-47 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex p-0 overflow-hidden">
      <CardContent className="text-center text-gray-700 p-0">
        <div className="w-full h-full bg-gray-500 " />
        <div className="h-26 text-left p-4 flex flex-col ">
          <h2 className="text-lg font-semibold">Document Title</h2>
          <p className="text-sm text-gray-500">
            Document description goes here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
