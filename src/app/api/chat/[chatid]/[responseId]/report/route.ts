import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ResponseReport from '@/models/Reporting';

// POST /api/chat/[chatid]/[responseId]/report
export async function POST(req: NextRequest, { params }: { params: Promise< { chatid: string, responseId: string }> }) {
  try {
    await dbConnect();
    const {  responseId } = await params;
    const body = await req.json();
    const { userId, message } = body;

    if (!userId || !message) {
      return NextResponse.json({ error: 'userId and message are required.' }, { status: 400 });
    }

    // Create a new report for the response
    const report = new ResponseReport({
      user: userId,
      response: responseId,
      message,
    });
    await report.save();

    return NextResponse.json({ message: 'Report submitted successfully.' }, { status: 201 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
