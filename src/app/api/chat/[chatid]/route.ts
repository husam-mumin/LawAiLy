import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Chat, { chatType } from "@/models/Chat";



// /**
//  * 
//  * Get Chat history for one chat
//  * 1. It Connect to the database. 
//  * 2. It get the slug in the address 
//  * 3. It Check if the Chat exists if not return a 404 NOT FOUND response. 
//  * 4. It get all message that has chatid that we need and get it with his responses ( one to many ).
//  * 5. It return Chat and message with 200 Success Response.
//  * 6. if any error occurs, return 500 internet Server error with the error message.
//  */


export type ChatWithIdGet  = {
  chat?: chatType,
  error?: string 
}


export async function GET(
   req: NextRequest, context:  { params: Promise<{ chatid : string}>}
) {
   try {
     await dbConnect();

     const { chatid } = await context.params;
     // Find chat by ID

     const chat = await Chat.findById<chatType>( chatid) 

  
     if (!chat) {
       return NextResponse.json({ error: "Chat not found." }, { status: 404 });
     }
    //  Find messages for this chat, populate responses
    // 
    return NextResponse.json({ chat }, { status: 200 });
// 
  } catch (error) {
    let message = "Internal server error.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest, context: { params: Promise<{ chatid: string }> }
) {
  try {
    await dbConnect();
    const { chatid } = await context.params;

    // Validate chatid
    if (!chatid) {
      return NextResponse.json({ error: "Chat ID is required." }, { status: 400 });
    }

    // Delete the chat
    const deletedChat = await Chat.findByIdAndDelete(chatid);

    if (!deletedChat) {
      return NextResponse.json({ error: "Chat not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Chat deleted successfully." }, { status: 200 });
  } catch (error) {
    let message = "Internal server error.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export type chatPutResponse = {
  chat: chatType
}

export async function PUT(req : NextRequest, context: { params: Promise<{ chatid: string }> }) {
  try {
    await dbConnect();
    const { chatid } = await context.params;

    // Validate chatid
    if (!chatid) {
      return NextResponse.json({ error: "Chat ID is required." }, { status: 400 });
    }

    // Parse request body
    const body = await req.json();
    const { title, isFavorite } = body;

    // Update the chat
    const updatedChat = await Chat.findByIdAndUpdate(
      chatid,
      { title, isFavorite },
      { new: true }
    );

    

    if (!updatedChat) {
      return NextResponse.json({ error: "Chat not found." }, { status: 404 });
    }

    return NextResponse.json({ chat: updatedChat }, { status: 200 });
  } catch (error) {
    let message = "Internal server error.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}