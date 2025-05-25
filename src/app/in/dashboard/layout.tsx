import ReactProps from "@/Types/ReactProps";
import React from "react";

type LayoutProps = {} & ReactProps;

export default function layout({ children }: LayoutProps) {
  return <div className="w-[90%] mx-auto">{children}</div>;
}
