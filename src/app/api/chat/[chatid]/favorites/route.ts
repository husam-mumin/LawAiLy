import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, context:  { params:{ chatid : string}} ) {
  try {
    await dbConnect()
    const { chatid } =  context.params;
    const body = await req.json();
    const { isFavorite }  =  body;

    const updateChat = await Chat.findByIdAndUpdate(chatid, { isFavorite: isFavorite }, { new: true});
    if(!updateChat) {
      return NextResponse.json( {message: "Chat not found"}, {status: 404 })
    }

    return NextResponse.json( updateChat, { status: 200})
    
  } catch (error) {
    let message = "Internal server error.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
  
}