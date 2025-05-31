import {  signOut } from '@/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * logout API route 
 * This route handle user logout by deleting the session cookie.
 * and handle any errors that may occur during the process. 
 * 
 */

export async function POST() {
  // Remove the auth cookie (adjust the cookie name as needed)
  await signOut();

  try {
  const cookiesStore = await cookies();
  cookiesStore.delete('session'); // Delete the session cookie
  return NextResponse.json({ message: "User logout successfully"}, {status: 200})
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
