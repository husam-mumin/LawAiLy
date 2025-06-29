import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";
import type { ComponentType } from "react";

export default function Authalert({
  Icon,
  title,
  description,
  className = "",
}: {
  Icon?: ComponentType | null;
  title: string;
  description: string;
  className?: HTMLElement["className"];
}) {
  return (
    <Alert
      className={`px-5 absolute top-0 right-1/2 translate-1/2 w-fit flex items-center
      
    ${className}`}
      dir="rtl"
      variant={"destructive"}
    >
      {Icon && <Icon />}
      <div>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
    </Alert>
  );
}
