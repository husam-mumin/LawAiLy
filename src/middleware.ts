import { NextRequest, NextResponse } from "next/server"




const protectedRoutes = [
  '/dashboard',
  '/in',
]

const publicRoutes = [
  '/login',
  '/register'
]

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Check if the route is protected
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const sessionCookie = req.cookies.get('session')

    // If no session cookie, redirect to login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }


  // Allow public routes without session check
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // For all other routes, continue as normal
  return NextResponse.next()
}