import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Users from "@/models/Users";

// POST: Set push subscription for a user
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, subscription } = await req.json();
    
    if (!userId || !subscription) {
      return NextResponse.json({ error: "userId و subscription مطلوبان" }, { status: 400 });
    }
    // Update the user's push subscription
    const user = await Users.findByIdAndUpdate(
      userId,
      { $set: { pushSubscription: subscription } },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    let message = "خطأ في الخادم الداخلي.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
