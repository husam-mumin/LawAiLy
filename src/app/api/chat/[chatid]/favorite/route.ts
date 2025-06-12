import { NextRequest, NextResponse } from 'next/server';
import Chat from '@/models/Chat';
import dbConnect from '@/lib/db';


export type ToggleFavoriteResponse = {
  message?: string;
  isFavorite?: boolean;
  error?: string;
};

// PATCH /api/chat/[chatid]/favorite
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ chatid: string }> }) {
  try {
    await dbConnect();
    const { chatid } = await params;
    if (!chatid) {
      return NextResponse.json({ error: 'chatid is required.' }, { status: 400 });
    }
    // Find chat
    const chat = await Chat.findById(chatid);
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found.' }, { status: 404 });
    }
    // Toggle isFavorite
    chat.isFavorite = !chat.isFavorite;
    await chat.save();
    return NextResponse.json({ message: 'Favorite status toggled.', isFavorite: chat.isFavorite }, { status: 200 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
