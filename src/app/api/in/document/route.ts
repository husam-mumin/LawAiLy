import { NextRequest, NextResponse } from "next/server";
import Document from "@/models/Documents";
import dbConnect from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing document id" }, { status: 400 });
  }

  try {
    await dbConnect();
    const document = await Document.findById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    return NextResponse.json(document);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
