import { NextRequest, NextResponse } from 'next/server';
import Message from '@/models/Messages';
import  dbConnect  from '@/lib/db';

/**
 * 
 * Sent just a message in exists chat
 * 1. It connect to the database.
 * 2. It check if the required fields (chatid, userid, message) and return a 400 response 
 * 3. It create new message with the provided details and save it to the database.
 * 4. It return a 201 response Create new Message 
 * 5. If any error occurs, it return a 500 Internal Server Error response with the error message.
 * 
 */

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { chatid, userid, message } = body;
    

    if (!chatid || !userid || !message) {
      return NextResponse.json({ error: 'chatid, title, userId, and message are required.' }, { status: 400 });
    }


    // Create new message
    const newMessage = new Message({
      message,
      users: userid,
      chat: chatid,
      responses: [],
      files: [],
    });
    await newMessage.save();


    return NextResponse.json({
      message: 'Chat and message created successfully.',
      chatId: chatid,
      newMessage,
    }, { status: 201 });
    
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
