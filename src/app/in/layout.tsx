import MainLayout from "@/components/layout/MainLayout/MainLayout";
import ReactProps from "@/Types/ReactProps";
import React from "react";
type layoutProps = {} & ReactProps;

export default function layout({ children }: layoutProps) {
  const isAuthUser = true; // ! replase this after add auther function

  return (
    <div>
      {isAuthUser ? (
        <MainLayout>
          <div className="container mx-auto">{children}</div>
        </MainLayout>
      ) : (
        children
      )}
    </div>
  );
}
