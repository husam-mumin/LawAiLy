import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import News from "@/models/NewsUser";
import NewsUser from "@/models/NewsUser";

// GET: Get all notifications for a user (user id in query param)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userid");
    if (!userId) {
      return NextResponse.json({ error: "معرف المستخدم مطلوب" }, { status: 400 });
    }
    const notifications = await NewsUser.find({ user: userId }).sort({ createdAt: -1 }).populate("new");
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    let message = "خطأ في الخادم الداخلي.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH: Mark a notification as read (id in query param)
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "معرف الإشعار مطلوب" }, { status: 400 });
    }
    const notif = await NewsUser.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!notif) {
      return NextResponse.json({ error: "الإشعار غير موجود" }, { status: 404 });
    }
    return NextResponse.json(notif, { status: 200 });
  } catch (error) {
    let message = "خطأ في الخادم الداخلي.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Delete a notification (id in query param)
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "معرف الإشعار مطلوب" }, { status: 400 });
    }
    const notif = await News.findByIdAndDelete(id);
    if (!notif) {
      return NextResponse.json({ error: "الإشعار غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    let message = "خطأ في الخادم الداخلي.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
