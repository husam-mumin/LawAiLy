import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = [
  '/dashboard',
  '/in',
]

const adminRoutes = [
  '/in/dashboard',
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

  // Get auth user from cookies (example: JWT or session cookie)
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

   const apiCalled = cookieStore.get('api_called')?.value


  type UserFromApi = {
    isBaned?: boolean;
    isAdmin?: boolean;
    // add other properties if needed
  };

  let userFromApi: UserFromApi | null = null;

  
  if (!apiCalled) {
    if (sessionCookie?.value) {
      try {
        const apiUrl = `${req.nextUrl.origin || ''}/api/in/user?id=${encodeURIComponent(sessionCookie.value)}`;
        const res = await fetch(apiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (res.ok) {
        userFromApi = await res.json() as UserFromApi;
        cookieStore.set('api_called',  JSON.stringify(userFromApi), {
        maxAge: 60 * 1    , // 30 days
        httpOnly: true,
    })
      }
    } catch {}
  }
  } else {
    try {
      
      userFromApi = JSON.parse(apiCalled) as UserFromApi;
    } catch (error) {
      console.error("Error parsing api_called cookie:", error);
      userFromApi = null; // Reset if parsing fails
    }
    
  }

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authUser: any = null;

  if (sessionCookie) {
    try {
      // If your session is a JWT, decode it here (example shown, adapt as needed)
      // import jwt from 'jsonwebtoken';
      // authUser = jwt.decode(sessionCookie.value);
      // If your session is a serialized JSON, parse it:
      // authUser = JSON.parse(sessionCookie.value);
    } catch  {
      // handle error
    }
  }

  // Fetch user details from API if session exists



  
  if (
    userFromApi?.isBaned &&
    protectedRoutes.some(route => pathname.startsWith(route))
  ) {

    return NextResponse.redirect(new URL('/banUser', req.url))
  }
  
  if (
    !userFromApi?.isBaned &&
    pathname == '/banUser'
  ) {
    return NextResponse.redirect(new URL('/in', req.url))
  }

  
  if (pathname === '/') {
    if (authUser) return NextResponse.redirect(new URL('/in', req.url))
    return NextResponse.next()
  }

  if (adminRoutes.some(route => pathname.startsWith(route)) ) {
    console.log(`Admin route accessed: ${pathname}`);
    console.log('user is admin:', userFromApi?.isAdmin);
    
    
    if( !userFromApi?.isAdmin) {
      
      if (!sessionCookie || !authUser) {
        return NextResponse.redirect(new URL('/in', req.url))
      }
    }
  }

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!sessionCookie && !authUser) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
  }

  if(userLoginRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionCookie && !authUser) return;
    return NextResponse.redirect(new URL('/in', req.url))
  }

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api')) {
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  if (!protectedRoutes.some(route => pathname.startsWith(route)) &&
      !publicRoutes.some(route => pathname.startsWith(route)) &&
      !pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}