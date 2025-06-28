import dbConnect from "@/lib/db";
import User from "@/models/Users";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise< { email: string } >}
) {
  try {
    await dbConnect();
    const { email } = await context.params;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    let message = "Internal server error.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

