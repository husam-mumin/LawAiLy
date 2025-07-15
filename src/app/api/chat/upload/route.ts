import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Files from "@/models/Files";

// POST /api/chat/upload
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    // Validate required fields for Files model

    const requiredFields = [
      "fileURL",
      "filename",
      "filesize",
      "fileformat",
      "filetext",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Save file info to database
    const fileDoc = await Files.create({
      fileURL: body.fileURL,
      filename: body.filename,
      filesize: body.filesize,
      fileformat: body.fileformat,
      filetext: body.filetext,
    });

    return NextResponse.json(
      { id: fileDoc._id, ...fileDoc.toObject() },
      { status: 201 }
    );
  } catch (error) {
    let message = "Internal server error.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
