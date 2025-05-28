import dbConnect from "@/lib/db";
import User from "@/models/Users";
import { NextResponse } from "next/server";

export type checkEmailType = {
  exists?: false,
  error?: string
} 
export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const { email } = body;
  if (!email){
    return NextResponse.json({ error: "Email is required" }, { status: 400});
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json({ exists: true })
  }
  return NextResponse.json({ exists: false })
}