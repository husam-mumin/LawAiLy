import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Document from "@/models/Documents";
import Chat from "@/models/Chat";
import Message from "@/models/Messages";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    const documentCount = await Document.countDocuments({ addedBy: userId });
    const chatCount = await Chat.countDocuments({ user: userId });
    const messageCount = await Message.countDocuments({ user: userId });
    
    return NextResponse.json({ documentCount, chatCount, messageCount });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analysis data" }, { status: 500 });
  }
}
