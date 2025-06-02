import MainLayout from "@/components/layout/MainLayout/MainLayout";
import React from "react";
type layoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: layoutProps) {
  return (
    <div>
      <MainLayout>
        <div className="container mx-auto">{children}</div>
      </MainLayout>
    </div>
  );
}
