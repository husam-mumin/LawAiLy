import { NextRequest, NextResponse } from 'next/server';
import Response from '@/models/Responses';
import dbConnect from '@/lib/db';
import Message, { IMessage} from '@/models/Messages';

const responseGenreter = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() =>
      resolve("بناءً على سؤالك القانوني، يرجى ملاحظة أن هذه الإجابة لا تُعد استشارة قانونية رسمية. إذا كنت تواجه قضية قانونية محددة، يُنصح بالتواصل مع محامٍ مختص.\n\nمثال: إذا كان السؤال يتعلق بحقوق العمل في المملكة العربية السعودية، فإن نظام العمل السعودي يكفل حقوق العامل وصاحب العمل، ويجب الالتزام بعقد العمل المبرم بين الطرفين، مع مراعاة الأنظمة واللوائح ذات الصلة. للمزيد من التفاصيل، يمكنك الرجوع إلى نظام العمل السعودي أو استشارة جهة قانونية مختصة.")
    , 1000);
  });
};
// This endpoint simulates an AI response, waits, saves it to the DB, and returns the saved response
export async function POST(req: NextRequest) {
  try {
    
    await dbConnect();
    const body = await req.json();
    
    const {  message, messageid, chat } = body;
    if( !message && !messageid && !chat){ 
      return NextResponse.json({message: "The message, messageid and chatid are required"}, { status: 404})
    }
    // Simulate AI response delay (2 seconds)
    const aiResponse = await responseGenreter()
    // Save response to DB
    const responseDoc = new Response({
      response: aiResponse,
      message: messageid,
      chat: chat,
      isGood: null
    });
    await responseDoc.save();
    
    const newss = await Message.findById<IMessage>(messageid)
    if(!newss) return NextResponse.json({message: "something go wrong"}, { status: 404})
      newss.response = responseDoc._id
    await newss.save()
    
      return NextResponse.json({
      responseDoc
    }, { status: 201 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}