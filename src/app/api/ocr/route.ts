import { NextResponse } from "next/server";
import { extractTextFromGCS } from "@/app/api/ocr/ocr"; // Adjust the import path as necessary

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, fileType } = body;
    if (!url) {
      return NextResponse.json({ error: "Missing file URL" }, { status: 400 });
    }
    // Call OCR function
    const text = await extractTextFromGCS(url, fileType, "text/plain");
    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    let message = "Internal server error.";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
