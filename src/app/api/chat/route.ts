import {  NextRequest, NextResponse } from 'next/server';
import Chat from '@/models/Chat';
import dbConnect from '@/lib/db';
import Message from '@/models/Messages';

/**
 * Get Chat List 
 * 1. It connect to the database. 
 * 2. It get all the Chats 
 * 3. check if there Chats, return 404 NOT FOUND response 
 * 4. return successfully , a 200 Response
 * 5. If any error occurs, return 500 Internal Server Error response with the error message.
 * 
 * endpoint
 * 
 */

// GET /api/chat
// Returns all chats with their title, isFavorite, users, and timestamps

export async function GET() {
  try {
    await dbConnect();
    const chats = await Chat.find();

    // check if there any Chat 
    if(chats.length == 0) return NextResponse.json({ chats: null, error: "No Chats Founds"}, { status: 404})

    
    return NextResponse.json( chats , { status: 200 });

  } catch (error) {

    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });

  }
}

/**
 * Create new Chat
 * 1. It connect to the database.
 * 2. It checks if the required fields (title, userid, message) are provided and return a 400 a bad request response.
 * 3. It Create a new Chat with default Data details and saves it to the database.
 * 4. It Create a new Message with provided Data and saves it to the database.
 * 4. If successful, it return a 201 Created response with success message.
 * 5. If any error occurs, it return 500 Internal Server Error response with the error message.
 * 
 */

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
