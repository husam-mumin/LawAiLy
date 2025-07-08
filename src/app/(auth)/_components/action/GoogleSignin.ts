"use server";

import { signIn } from "@/auth";

export async function signinaction() {
  return await signIn("google", { redirectTo: "/in" });
}
