import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST() {
  // Generate a guest ID
  const guestId = new mongoose.Types.ObjectId();
  // Set guest_id cookie (valid for 7 days)
  const response = NextResponse.json({
    message: "Guest login successful",
    guestId,
    isGuest: true,
  });
  response.cookies.set("guest_id", guestId.toString(), {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 days
    httpOnly: false, // Allow client JS to read
    sameSite: "lax",
  });
  return response;
}
