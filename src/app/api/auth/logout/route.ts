import { NextResponse } from "next/server";

/**
 * logout API route
 * This route handle user logout by deleting the session cookie.
 * and handle any errors that may occur during the process.
 *
 */

export async function POST() {
  // Remove the auth cookie (adjust the cookie name as needed)

  try {
    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.set("token", "", { maxAge: 0 });
    res.cookies.set("refreshToken", "", { maxAge: 0 });
    return res;
  } catch (error) {
    let message = "Internal server error.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
