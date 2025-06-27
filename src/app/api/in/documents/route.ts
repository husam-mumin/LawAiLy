import {  NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Document from '@/models/Documents';

export async function GET() {
  try {

    await dbConnect();
    console.log('Fetching documents from the database...');
    
    const documents = await Document.find({}).populate('addedBy', 'email firstName lastName').sort({ createdAt: -1 });
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, url, description, showup, addBy } = body;
    console.log('Creating a new document with data:', body);
    if (!title || !url || !description || !addBy) {
      return NextResponse.json({ error: 'title, url, description, and addBy are required.' }, { status: 400 });
    }

    // Create new document
    const newDocument = new Document({
      title,
      documentURL: url,
      description,
      showup,
      addedBy: addBy,
    });

    await newDocument.save();

    return NextResponse.json({
      message: 'Document created successfully.',
      document: newDocument,
    }, { status: 201 });

  } catch (error) {
    let message = 'Internal server error. ' + error;
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 });
    }

    console.log('Deleting document with URL:', url);
    
    // Find and delete the document
    const deletedDocument = await Document.findOneAndDelete({ documentURL: url });

    if (!deletedDocument) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Document deleted successfully.',
      document: deletedDocument,
    }, { status: 200 });

  } catch (error) {
    let message = 'Internal server error. ' + error;
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, title, url, description, showUp } = body;

    if (!id || !title || !description || !url || showUp === undefined) {
      return NextResponse.json({ error: 'id, title, and description are required.' }, { status: 400 });
    }

    console.log('Updating document with ID:', id);
    
    // Find and update the document
    const updatedDocument = await Document.findByIdAndUpdate(id, { title, description, documentURL: url, showUp: showUp }, { new: true });

    if (!updatedDocument) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Document updated successfully.',
      document: updatedDocument,
    }, { status: 200 });

  } catch (error) {
    let message = 'Internal server error. ' + error;
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
