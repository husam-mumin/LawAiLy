import { NextRequest, NextResponse } from 'next/server';
import User, { IUser } from '@/models/Users';
import  dbConnect  from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password, gender } = body;
    console.log(body);
    

    if (!email || !password || !gender) {
      return NextResponse.json({ error: 'Email, password, and gender are required.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne<IUser>({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email.' }, { status: 409 });
    }

    const cryptPassword = bcrypt.hashSync(password.trim(), 10);

    // Create new user
    const user = new User({
      email,
      password: cryptPassword, // Store the hashed password
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      AvatarURL: body.AvatarURL || '',
      isAdmin: body.isAdmin || false,
      gender,
      
    });
    await user.save();
    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

