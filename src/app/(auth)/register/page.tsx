"use client";

import GoogleLoginButton from "../_components/GoogleLoginButton";
import RegisterForm from "./RegisterForm";

export default function page() {
  return (
    <div className="h-screen w-screen flex justify-center items-center overflow-hidden">
      <div className="flex w-fit items-center justify-center md:bg-gray-100 px-8 py-10 rounded-lg md:shadow-lg">
        <div className="flex h-fit flex-col items-center justify-center">
          <div className="h-20 w-full bg-gray-500 rounded-md" />
          <RegisterForm />
          <GoogleLoginButton />
        </div>
        <div className="ms-15 hidden md:block h-100 w-20 md:w-85 lg:w-120">
          <div className="bg-gray-500 w-full h-full rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  );
}
