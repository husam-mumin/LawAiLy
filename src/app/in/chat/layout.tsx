import ReactProps from "@/Types/ReactProps";
import React from "react";
type layoutProps = {} & ReactProps;

export default function layout({ children }: layoutProps) {
  return <div>{children}</div>;
}
