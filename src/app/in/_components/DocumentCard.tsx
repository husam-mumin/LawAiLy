import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface DocumentCardProps {
  title: string;
  description: string;
}

export default function DocumentCard({
  title,
  description,
}: DocumentCardProps) {
  return (
    <Card className="cursor-pointer w-64 h-52 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex p-0 overflow-hidden">
      <CardContent className="text-center text-gray-700 p-0">
        <div className="w-full h-full bg-gray-500 " />
        <div className="h-26 text-right p-4 flex flex-col ">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
