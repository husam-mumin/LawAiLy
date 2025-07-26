import { NextRequest, NextResponse } from "next/server";
import { JWTPayload, jwtVerify } from "jose";

export interface UserPayload extends JWTPayload {
  id: number;
  email: string;
  role: "admin" | "user" | "owner";
  isBanned: boolean;
}

const publicRoutes = ["/"];
const secret = new TextEncoder().encode(process.env.REFRESH_SECRET!);

export default async function middleware(req: NextRequest) {
  const token = await req.cookies.get("refreshToken")?.value;
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;
  const isShare = req.nextUrl.searchParams.get("shared") === "true";

  // console.log("Middleware token:", token?.slice(0, 5));

  // Skip middleware for /api/auth/login and /api/auth/register
  if (pathname.startsWith("/api/auth")) {
    // console.log("Middleware: Skipping for auth login/register");

    return NextResponse.next();
  }

  if (token && isShare) {
    // Allow access to shared chat without authentication
    return NextResponse.next();
  }

  const guestId = req.cookies.get("guest_id")?.value;
  if (guestId) {
    // Allow guest users to access /in and subroutes
    if (pathname.startsWith("/in")) {
      return NextResponse.next();
    }
  }

  if (publicRoutes.some((route) => pathname == route)) {
    // Allow access to public routes
    return NextResponse.next();
  }
  if (!token && !guestId) {
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      // If already on the login page, allow access
      return NextResponse.next();
    }

    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  try {
    if (!token) {
      // If no token, redirect to login
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    const { payload } = await jwtVerify<UserPayload>(token, secret);
    if (payload.isBaned) {
      url.pathname = "/banUser";
      return NextResponse.redirect("/banUser");
    }

    if (
      pathname.startsWith("/in/dashboard") &&
      payload.role !== "admin" &&
      payload.role !== "owner"
    ) {
      url.pathname = "/in";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/in")) {
      return NextResponse.next();
    }

    url.pathname = "/in";
    return NextResponse.redirect(url);
  } catch (error) {
    if (error instanceof Error) {
      console.error("JWT verification error:", error.message);
    } else {
      console.error("JWT verification error:", error);
    }
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
export const config = {
  matcher: [
    "/in/:path*", // Protect all /in and subroutes
    "/api/:path*", // Protect all API routes
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/banUser", // If you want to protect this as well
  ],
};
