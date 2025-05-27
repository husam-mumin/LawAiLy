import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
  return <div className="w-[90%] mx-auto">{children}</div>;
}
