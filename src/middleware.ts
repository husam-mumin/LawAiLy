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

/**
 * todo check if the user ban and redirect to ban page
 * 
 * @param req 
 * @returns 
 */

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Check if the route is protected
  const authSession = await auth()

  if (pathname === '/') {
    console.log('Home page accessed');
    
    if (authSession?.user) return NextResponse.redirect(new URL('/in', req.url))
    return NextResponse.next()
  }
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

  if (pathname.startsWith('/api')) {
    // For API routes, check if the user is authenticated
    if (!authSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Allow API requests to proceed
    return NextResponse.next()
  }

  // If the route is not protected, public, or an API route, continue as normal
  if (!protectedRoutes.some(route => pathname.startsWith(route)) &&
      !publicRoutes.some(route => pathname.startsWith(route)) &&
      !pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // If is the Home page or any public route, directly to in if is authenticated
  // For all other routes, continue as normal
  return NextResponse.next()
}