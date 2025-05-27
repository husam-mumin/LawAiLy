import { NextRequest, NextResponse } from 'next/server';
import User, { IUser }  from '@/models/Users';
import  dbConnect  from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await User.findOne<IUser>({ email });
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
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      AvatarURL: user.AvatarURL,
      id: user._id,
    } }, { status: 200 });

  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
