import { NextRequest, NextResponse } from 'next/server';
import User, { IUser, userType }  from '@/models/Users';
import  dbConnect  from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

/**
 * the login function handles user login requests.
 * It performs the following steps:
 * 1. Connects to the database.
 * 2. Parses the request body to extract email and password.
 * 3. Validates the input, ensuring both email and password are provided.
 * 4. Searches for the user by email in the database.
 * 5. If the user is not found, returns a 404 Not Found response.
 * 6. If the user is found, compares the provided password with the stored hashed password.
 * 7. If the password is incorrect, returns a 401 Unauthorized response.
 * 8. If the password is correct, sets a secure, HttpOnly cookie with the user ID.
 * 9. Returns a 200 OK response with a success message and user data (excluding the password).
 * 10. Handles any errors that occur during the process, returning a 500 Internal Server Error response with an error message.
 * 
 * The cookie is set with the following attributes: 
 * - 'httponly' to prevent client-side access,
 * - 'secure' to ensure it is only sent over HTTPS in production,
 * - 'sameSite' set to 'strict' to prevent CSRF attacks,
 * - 'maxAge' set to 1 week to maintain the session.
 * 
 * endPoint 
 *
 */

export type loginRequestType = {
  error?: string,
  message?: string,
  user: userType
}
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body: { user: { email: string, password: string }} = await req.json();
    const { email, password } = body.user;
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await User.findOne<IUser>({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }


    // In production, use bcrypt to compare hashed passwords
    
    if (!bcrypt.compareSync(password.trim(), user.password)) {
      
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }
    const cookiesStore = await cookies();
    const userId =  user._id as string;

    // Set a secure, HttpOnly cookie with the user ID
    // This cookie will be used to identify the user in subsequent requests
    cookiesStore.set('session', userId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 60 * 60 * 24 * 7, // 1 week
      
    });
    // Optionally, return user data (never return password)
    return NextResponse.json({ message: 'Login successful.', user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } }, { status: 200 });

  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
