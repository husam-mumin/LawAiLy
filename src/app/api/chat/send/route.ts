import { NextRequest, NextResponse } from 'next/server';
import Chat from '@/models/Chat';
import Message from '@/models/Messages';
import  dbConnect  from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, userId, message } = body;

    if (!title || !userId || !message) {
      return NextResponse.json({ error: 'title, userId, and message are required.' }, { status: 400 });
    }

    // Create new chat
    const chat = new Chat({
      title,
      users: [userId],
      isFavorite: false,
    });
    await chat.save();

    // Create new message
    const newMessage = new Message({
      message,
      users: userId,
      chat: chat._id,
      responses: [],
      files: [],
    });
    await newMessage.save();

    return NextResponse.json({
      message: 'Chat and message created successfully.',
      chatId: chat._id,
      chat,
      newMessage,
    }, { status: 201 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
