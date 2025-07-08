import { NextRequest, NextResponse } from "next/server";
import { JWTPayload, jwtVerify } from "jose";

export interface UserPayload extends JWTPayload {
  id: number;
  email: string;
  role: "admin" | "user" | "owner";
  isBanned: boolean;
}

const ADMIN_PATHS = ["/in/dashboard"];
const user_authenticated_paths = [];
const publicRoutes = ["/"];
const secret = new TextEncoder().encode(process.env.REFRESH_SECRET!);

export default async function middleware(req: NextRequest) {
  const token = await req.cookies.get("refreshToken")?.value;
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;
  console.log("Middleware pathname:", pathname);

  // console.log("Middleware token:", token?.slice(0, 5));

  // Skip middleware for /api/auth/login and /api/auth/register
  if (pathname.startsWith("/api/auth")) {
    // console.log("Middleware: Skipping for auth login/register");

    return NextResponse.next();
  }

  if (publicRoutes.some((route) => pathname == route)) {
    // Allow access to public routes
    return NextResponse.next();
  }
  if (!token) {
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
