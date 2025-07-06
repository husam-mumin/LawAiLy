import Image from "next/image";
import React from "react";

export default function TopLogo() {
  return (
    <div className="flex items-center justify-center">
      <div className="text-lg w-57   rounded-full  flex items-center justify-center">
        <Image
          src="/MainLogo.png"
          className="w-fit h-fit"
          width={150}
          height={100}
          alt="logo"
        />
      </div>
    </div>
  );
}
