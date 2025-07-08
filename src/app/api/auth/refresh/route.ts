import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, createAccessToken } from "@/utils/jwt";

export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) throw new Error("Refresh token not found.");

    const { payload } = await verifyRefreshToken(refreshToken);

    const newAccessToken = await createAccessToken(payload);

    const res = NextResponse.json({ accessToken: newAccessToken });
    res.cookies.set("token", newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 1, // 1 minutes
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });
    return res;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error.",
      },
      { status: 401 }
    );
  }
}
