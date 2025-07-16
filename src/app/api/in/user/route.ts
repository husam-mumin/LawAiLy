import dbConnect from "@/lib/db";
import User, { userType } from "@/models/Users";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "User id is required" },
        { status: 400 }
      );
    }
    const user = await User.findById(id).select("-password").lean();
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

export type userPatch = {
  user: userType;
  error?: string;
};

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User id is required" },
        { status: 400 }
      );
    }
    const body = await req.json();

    const { firstName, lastName, photoUrl } = body;
    if (!firstName && !lastName && !photoUrl) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }
    let user = null;
    if (!firstName) {
      user = await User.findByIdAndUpdate(
        id,
        {
          AvatarURL: body.photoUrl,
        },
        { new: true, runValidators: true, select: "-password" }
      ).lean();
    } else {
      user = await User.findByIdAndUpdate(
        id,
        { firstName, lastName },
        { new: true, runValidators: true, select: "-password" }
      ).lean();
    }
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
