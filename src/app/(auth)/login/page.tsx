import Link from "next/link";
import React from "react";
import LoginForm from "./LoginForm";
import GoogleLoginButton from "../_components/GoogleLoginButton";

export default function page() {
  return (
    <div className="h-dvh w-screen flex justify-center items-center overflow-hidden ">
      <div className="flex w-fit  items-center justify-center md:bg-gray-100 px-8 py-10 rounded-lg  md:shadow-lg">
        <div className="flex h-fit flex-col items-center justify-center ">
          {/* <div className="flex  items-center justify-center mb-10">
          <div className="text-2xl font-bold">Login Page</div>
        </div> */}
          <div className="flex items-center justify-center">
            <div className="text-lg bg-gray-400 size-30 rounded-full mb-2 flex items-center justify-center">
              Logo
            </div>
          </div>
          <div className="flex items-center justify-center ">
            <LoginForm />
          </div>

          <div className="flex w-full items-center justify-center -mt-4 text-secondary-foreground/80">
            <div className="text-sm">
              Don&apos;t have an account?
              <Link
                className=" ms-2 text-secondary-foreground/80 hover:text-secondary-foreground/100 transition-colors duration-200"
                href={"/register"}
              >
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex w-full items-center justify-center mt-10">
            <GoogleLoginButton />
          </div>
        </div>
        <div className=" ms-15 hidden md:block h-100 w-20  md:w-85 lg:w-120 ">
          <div className="bg-gray-500  w-full h-full rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  );
}
