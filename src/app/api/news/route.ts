import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Users from "@/models/Users";
import NewsUser from "@/models/NewsUser";
import News from "@/models/New";

// GET: Get all news
export async function GET() {
  try {
    await dbConnect();
    const news = await News.find({}).sort({ createdAt: -1 });
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    let message = "خطأ في الخادم الداخلي.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Add news and send notification to all users
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ error: "العنوان والمحتوى مطلوبان" }, { status: 400 });
    }
    // Create the news item
    const news = await News.create({ title, content });
    // Get all users
    const users = await Users.find({}, "_id");
    // Create a notification for each user
    const notifications = users.map((user: {_id: string}) => ({
      user: user._id,
      read: false,
      new: news._id.toString(), // Ensure news ID is a string
    }));
    // Insert notifications in bulk

    await NewsUser.insertMany(notifications);
    
    
    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.log(error);
    
    let message = "خطأ في الخادم الداخلي.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
