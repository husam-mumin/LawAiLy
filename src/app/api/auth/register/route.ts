import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/Users';
import  dbConnect  from '@/lib/db';
import bcrypt from 'bcryptjs';

/**
 * register useCase 
 * This API route handle user registration.
 * 1. It connects to the database.
 * 2. It checks if the required fields (email, password, gender) are provided if don't get anyone of the required fields return a 400 a bad request response .
 * 3. It checks if a user with the provided email already exists, return 409 Conflict Response.
 * 4. It hashes the password using bcrypt.
 * 5. It creates a new user with the provided details and saves it to the database.
 * 6. If successful, it returns a 201 Created response with a success message.
 * 7. If any error occurs, it returns a 500 Internal Server Error response with the error message.
 * 
 */

type body ={
 email: string,
 password: string,
 firstName: string,
 lastName: string,
 AvatarURL: string,
 isAdmin: boolean,
 gender: string
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body: body = await req.json();
    const { email, password, gender } = body;
    

    if (!email || !password || !gender) {
      return NextResponse.json({ error: 'Email, password, and gender are required.' }, { status: 400 });
    }

    // Check if user already exists

    const cryptPassword = await bcrypt.hashSync(password.trim(), 10);

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
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

