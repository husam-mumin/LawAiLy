import dbConnect from "@/lib/db";
import User from "@/models/Users";
import { NextResponse } from "next/server";

/**
 * this return all Users in database
 * 1. It connects to the database
 * 2. It get the users data from the database.
 * 3. Check if there users, return 404 NOT FOUND response.
 * 4. return all users data without the password, with 200 response.
 * 5. if any error occurs, return a 500 Internal Server Error response with the error message. 
 * 
 */

export async function GET() {
  try { 

    await dbConnect()
    const users = await User.find().select('-password')
    if(users.length == 0) return NextResponse.json({error: "No Users register"}, { status: 404});
    return NextResponse.json({message: "get users successfully", users: users}, { status: 200})

  } catch (error) {
    let message = 'Internal server error';
    if (error instanceof Error) message = error.message
    return NextResponse.json({ users: null, error: message }, { status: 500 })
  }
}