import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ShareResponse from '@/models/ShareResponse';
import { Types } from 'mongoose';

// POST /api/chat/[chatid]/[responseId]/isshared
export async function POST(req: NextRequest, { params }: { params: Promise< { chatid: string, responseId: string }> }) {
  try {
    await dbConnect();
    const { responseId } = await params;
    const body = await req.json();
    const { userId } = body;

    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }

    // Validate responseId
    if (!Types.ObjectId.isValid(responseId)) {
      return NextResponse.json({ error: 'Invalid responseId.' }, { status: 400 });
    }

    // Check if the response exists
    const existingShare = await ShareResponse.findOne({ response: responseId, user: userId });

    if (existingShare) {
      return NextResponse.json({ error: 'Response already shared by this user.' }, { status: 400 });
    }

    // Create a new share record
    const share = new ShareResponse({
      user: userId,
      response: responseId,
    });
    await share.save();

    return NextResponse.json({ message: 'Response shared successfully.' }, { status: 201 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

