'use server';

import { signIn } from "@/auth";

export async function signinaction() {
  await signIn("google", { redirectTo: "/in" });

}