import { NextRequest, NextResponse } from "next/server";
import Message, { messageType } from "@/models/Messages";
import dbConnect from "@/lib/db";
import Response from "@/models/Responses";

// GET /api/chat/[chatid]
// Returns: {
//   chat: { title: string },
//   messages: [
//     {
//       _id: string,
//       message: string,
//       responses: [
//         { _id: string, response: string, isGood: boolean | null }
//       ]
//     }, ...
//   ]
// }



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

export type AIResponseType = {
  response : string,
  message: string,
  chat: string, 
  isGood: boolean | null
}

export type filesType = {
  fileURL: string,
  filename: string,
  filesize: string,
  fileformat: string,
  filetext: string,
  message: string
}

export type messageResponse = {
  _id: string,
  message: string,
  users: string,
  chat: string,
  responses: AIResponseType,
  files: filesType,
  createAt: Date,
  updateAt: Date,
}

export async function GET(
   req: NextRequest, context:  { params:{ chatid : string}}
) {
   try {
     await dbConnect();

     const { chatid } = context.params;
     // Find chat by ID

     const chat = await Message.find<messageType>({ chat: chatid}).populate({
      path: "response",
      model: Response
     });
  
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

export async function POST(req: NextRequest,
  context:  { params:{ chatid : string}}

){

   try {
     await dbConnect();

     const { chatid } = await context.params;
     const body = await req.json()
     const { mes, userid } =  body;

     if( !chatid && !mes){
      return NextResponse.json({ error: 'chatid, message are required.' }, { status: 400 });
     }

     const messag = new Message({
      message: mes,
      chat: chatid,
      user: userid,
     })


     await messag.save();
     
     return NextResponse.json( messag , { status: 201})

} catch (error) {
    let message = "Internal server error.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }

}
