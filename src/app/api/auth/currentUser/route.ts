import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import dbConnect from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { UserPayload } from "@/middleware";

/**
 * user cases
 * 1. Get the current user based on the session cookie.
 * 2. if the cookie is not present, return a 401 Unauthorized response.
 * 3. if the user is not found, return a 404 User Not Found response.
 * 4. if the user is found, return the user data without the password field.
 * 5. if any error occurs, return a 500 Internal Server Error response with the error message.
 */
const secret = new TextEncoder().encode(process.env.REFRESH_SECRET!);

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // Adjust the cookie name as needed (e.g., 'auth', 'token', etc.)
    const token = (await req)
      ? req.cookies.get("refreshToken")?.value
      : (await cookies()).get("refreshToken")?.value;
    if (!token) {
      const res = NextResponse.json(
        { user: null, error: "Unauthorized. No session cookie found." },
        { status: 401 }
      );
      return res;
    }

    const { payload } = await jwtVerify<UserPayload>(token, secret);

    const userId = payload.id;
    console.log("User ID from token payload:", userId);
    if (!userId) {
      return NextResponse.json(
        { user: null, error: "Unauthorized. No session cookie found." },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { user: null, error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    let message = "Internal server error.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ user: null, error: message }, { status: 500 });
  }
}
