import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"




const protectedRoutes = [
  '/dashboard',
  '/in',
]

const userLoginRoutes = [
  '/login',
  '/register'
]

const publicRoutes = [
  '/'
]

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Check if the route is protected
  const authSession = await auth()
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const sessionCookie = req.cookies.get('session')
    
    // If no session cookie, redirect to login
    if (!sessionCookie && !authSession?.user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  if(userLoginRoutes.some(route => pathname.startsWith(route))) {
    const sessionCookie = req.cookies.get('session')
    if (!sessionCookie && !authSession?.user) return;
    return NextResponse.redirect(new URL('/in', req.url))
  }

  // Allow public routes without session check
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // For all other routes, continue as normal
  return NextResponse.next()
}