import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import dbConnect from "./lib/db";
import User from "./models/Users";
import { cookies } from "next/headers";
import { createAccessToken, createRefreshToken } from "./utils/jwt";

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
          AvatarURL: user.image || "",
          gender: profile?.gender || "other",
          firstName: "",
          lastName: "",
        });
      }
      // Set a session cookie with the user ID

      if (!dbUser?._id) return false;
      const tokenPayload = {
        id: (dbUser._id as unknown as { toString: () => string }).toString(), // convert ObjectId to string
        email: dbUser.email,
        role: dbUser.role,
        isBanned: dbUser.isBaned || false, // fix typo here too
      };

      const accessToken = await createAccessToken(tokenPayload);
      const refreshToken = await createRefreshToken(tokenPayload);

      const cookiesStore = await cookies();

      cookiesStore.set("token", accessToken, {
        httpOnly: true,
        maxAge: 60 * 1, // 1 minute
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        path: "/", // Cookie is available site-wide
      });

      cookiesStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        path: "/", // Cookie is available site-wide
      });

      return true;
    },
  },
});
