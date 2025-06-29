import NextAuth from "next-auth"
import Google from 'next-auth/providers/google'
import dbConnect from "./lib/db";
import User from "./models/Users";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, profile }) {
      await dbConnect();

      const existingUser = await User.findOne({ email: user.email });

      let dbUser = existingUser;
      if (!existingUser) {
        dbUser = await User.create({
          email: user.email,
          AvatarURL: user.image || '',
          gender: profile?.gender || 'other',
        });
      }
      console.log(
       profile?.gender
      );
      // Set a session cookie with the user ID
      if (dbUser?._id) {
        const cookiesStore = await cookies();
        cookiesStore.set('session', dbUser._id.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }

      return true; // Allow sign in
    }
  }
})