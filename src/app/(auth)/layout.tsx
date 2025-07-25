import React from "react";

type layoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: layoutProps) {
  return (
    <div dir="rtl">
      <div>{children}</div>
    </div>
  );
}
