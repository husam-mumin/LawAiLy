import {  NextResponse } from 'next/server';
import User from '@/models/Users';
import  dbConnect  from '@/lib/db';
import { cookies } from 'next/headers';

/**
 * user cases 
 * 1. Get the current user based on the session cookie.
 * 2. if the cookie is not present, return a 401 Unauthorized response.
 * 3. if the user is not found, return a 404 User Not Found response.
 * 4. if the user is found, return the user data without the password field.
 * 5. if any error occurs, return a 500 Internal Server Error response with the error message. 
 */

export async function GET() {

  try {
  const cookiesStore = await cookies();
    
    await dbConnect();
    // Adjust the cookie name as needed (e.g., 'auth', 'token', etc.)
    const cookie = cookiesStore.get("session")
    if (!cookie) {
      return NextResponse.json({ user: null, error: 'Not authenticated.' }, { status: 401 });
    }
    // Example: If the cookie contains the user ID directly
    const userId = cookie.value;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ user: null, error: 'User not found.' }, { status: 404 });
    }
    
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ user: null, error: message }, { status: 500 });
  }
}
