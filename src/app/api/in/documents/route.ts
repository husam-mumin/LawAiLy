import {  NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Document from '@/models/Documents';
export type fetchedDocumentType = {
  _id: string;
  createdAt: Date;
  documentURL: string;
  title: string;
  description: string;
  image: string;
  showUp: boolean;
  addedBy: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  category?: {
    _id: string;
    name: string;
description: string;
  };
};
export async function GET() {
  try {

    await dbConnect();

    const documents = await Document.find({})
    .populate('addedBy', 'email firstName lastName')
    .sort({ createdAt: -1 });
    
    
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
    const { title, documentURL, description, category ,  showUp,  addedBy, image } = body;
    if (!title || !documentURL || !description || !addedBy) {
      return NextResponse.json({ error: 'title, url, description, and addBy are required.' }, { status: 400 });
    }

    // Check if document with same documentURL exists
    const existingDoc = await Document.findOne({ documentURL });
    if (existingDoc) {
      return NextResponse.json({
        error: 'Document already exists.',
        url: existingDoc.documentURL,
        document: existingDoc,
      }, { status: 409 });
    }

    // Create new document
    const newDocument = new Document({
      title,
      documentURL: documentURL,
      description,
      category: category || null, // Optional category
      showup: showUp,
      image: image || '',
      addedBy: addedBy,
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
    const { id } = body;

    
    if (!id) {
      return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    }

    
    // Find and delete the document
    const deletedDocument = await Document.findOneAndDelete({ _id: id });

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

export type UpdateDocumentRequest = {
  id: string;
  title: string;
  documentURL: string;
  description: string;
  showUp: boolean;
};


export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const {  _id, title, category,  documentURL,image, description, showUp } = body;

    
    if (!_id || !title || !description  || !image || !documentURL || showUp === undefined) {
      
      return NextResponse.json({ error: 'id, description, url, showup are required!' }, { status: 400 });
    }

    
    // Find and update the document
    const updatedDocument = await Document
    .findByIdAndUpdate(_id, 
      { title, description, category, documentURL: documentURL, image, showUp: showUp }, { new: true });

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
