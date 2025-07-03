import { NextRequest, NextResponse } from 'next/server';
import Response from '@/models/Responses';
import dbConnect from '@/lib/db';
import Message, { IMessage} from '@/models/Messages';

const responseGenreter = (): Promise<string> => {
  // Simulated AI response for Libyan Law
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          `بناءً على سؤالك القانوني حول القوانين الليبية، يرجى ملاحظة أن هذه الإجابة لا تُعد استشارة قانونية رسمية. إذا كنت تواجه قضية قانونية محددة في ليبيا، يُنصح بالتواصل مع محامٍ مختص أو جهة قانونية رسمية.

**مثال:** إذا كان السؤال يتعلق بحقوق العمل في ليبيا، فإن قانون العمل الليبي رقم 12 لسنة 2010 ينظم العلاقة بين العامل وصاحب العمل، ويشمل حقوق وواجبات الطرفين مثل الأجر، وساعات العمل، والإجازات، والتأمين الاجتماعي. يجب الالتزام بعقد العمل المبرم بين الطرفين، مع مراعاة اللوائح التنفيذية ذات الصلة.

للمزيد من التفاصيل، يمكنك الرجوع إلى نصوص قانون العمل الليبي أو استشارة نقابة المحامين أو وزارة العمل الليبية.

> **تنويه:** هذه الإجابة لأغراض التوعية العامة فقط ولا تغني عن الاستشارة القانونية المتخصصة.`
        ),
      1000
    );
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
      response: responseDoc
    }, { status: 201 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}