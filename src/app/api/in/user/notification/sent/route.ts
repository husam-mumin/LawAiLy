import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

// Make sure to configure your VAPID keys somewhere in your project
// webpush.setVapidDetails('mailto:your@email.com', process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {  payload } = body;

    if (!payload) {
      return NextResponse.json({ error: "payload " }, { status: 400 });
    }

    // sent to all users 
    // give all the user the pushNotification are not null 
    const users = await  User.find({ pushSubscription: { $ne: null } });

    if (users.length === 0) {
      return NextResponse.json({ error: "لا يوجد مستخدمين للاشتراك في الإشعارات" }, { status: 404 });
    }
    const pushPayload = JSON.stringify(payload);
    users.forEach((user) => {
      if (user.pushSubscription) {
        webpush.sendNotification(
          user.pushSubscription,
          pushPayload
        )
      }})

    return NextResponse.json({ message: "Push sent." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطأ في إرسال الإشعار" },
      { status: 500 }
    );
  }
}