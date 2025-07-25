import dbConnect from "@/lib/db";
import Response from "@/models/Responses";
import { NextRequest, NextResponse } from "next/server";

/**
 * here we get the responseId and what they went isGood to be
 * like or Dislike or noting
 * like is true 
 * Dislike is false
 * nothing is null
 * get the data then check if they exists 
 * then return a message if the change work 
 * and return error if the change don't work
 * @param req 
 * @param param1 
 * @returns 
 */


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ chatid: string, responseId: string, isGood: string}>}) {

  try {
    await dbConnect()
    const { chatid, responseId, isGood} = await params;
    
    
    if (!chatid || !responseId ){
      return NextResponse.json( { error: "sorry but something was wrong"}, {status: 404})
    }

    const response = await Response.findById(responseId)
    
    if (!response){
      return NextResponse.json( { error: "no response find"}, { status: 404})
    }
    let isGoodValue: boolean | null;
    if (isGood === "true") isGoodValue = true;
    else if (isGood === "false") isGoodValue = false;
    else isGoodValue = null;
    await Response.findByIdAndUpdate( responseId , { isGood: isGoodValue }, { new: true})
    

    return NextResponse.json( { message: "changing happen successfully", isGood: isGoodValue }, {status: 200})

  } catch (error){
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}