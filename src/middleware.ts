import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  '/dashboard',
  '/in',
];

const adminRoutes = [
  '/in/dashboard',
];

const userLoginRoutes = [
  '/login',
  '/register'
];

const publicRoutes = [
  '/'
];

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  const apiCalled = cookieStore.get('api_called')?.value;
  
  
  type UserFromApi = {
    isBaned?: boolean;
    role?: 'user' | 'admin' |'owner';
        email?: string;
  };

  let userFromApi: UserFromApi | null = null;

  // Always prefer userFromApi for authorization logic
  if (!apiCalled) {
    if (sessionCookie?.value ) {
      try {
        const apiUrl = `${req.nextUrl.origin || ''}/api/in/user?id=${encodeURIComponent( sessionCookie.value  || "")}`;
        const res = await fetch(apiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (res.ok) {
          userFromApi = await res.json() as UserFromApi;
          cookieStore.set('api_called', JSON.stringify(userFromApi), {
            maxAge: 60 * 1, // 1 minute
            httpOnly: true,
          });
        }
      } catch {}
    }
  } else {
    try {
      userFromApi = JSON.parse(apiCalled) as UserFromApi;
    } catch (error) {
      console.error("Error parsing api_called cookie:", error);
      userFromApi = null;
    }
  }

  // Ban logic
  if (
    userFromApi?.isBaned &&
    protectedRoutes.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL('/banUser', req.url));
  }

  if (
    !userFromApi?.isBaned &&
    pathname === '/banUser'
  ) {
    return NextResponse.redirect(new URL('/in', req.url));
  }

  // Auth logic for /
  if (pathname === '/') {
    console.log(userFromApi);
    
    if (sessionCookie && userFromApi) return NextResponse.redirect(new URL('/in', req.url));

    return NextResponse.next();
  }


  // Admin route logic
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (userFromApi?.role == 'user') {
      return NextResponse.redirect(new URL('/in', req.url));
    }
  }

  // Protected route logic
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionCookie || !userFromApi) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // User login routes
  if (userLoginRoutes.some(route => pathname.startsWith(route))) {
    if (sessionCookie && userFromApi) {
      return NextResponse.redirect(new URL('/in', req.url));
    }
    return NextResponse.next();
  }

  // Public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // API routes
  if (pathname.startsWith('/api')) {
    if (!sessionCookie || !userFromApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Default allow
  return NextResponse.next();
}