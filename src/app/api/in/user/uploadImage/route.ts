import { randomUUID } from "crypto";
import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import File from "@/models/Files";
import { bucket } from "@/app/api/dashboard/documents/file/_action/getfunction";

export const config = {
  api: {
    bodyParser: false,
  },
};

function generateUniqueFileName(originalName: string): string {
  const ext = originalName.includes('.') ? '.' + originalName.split('.').pop() : '';
  return `${Date.now()}-${randomUUID()}${ext}`;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max size is 2MB." }, { status: 413 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueName = generateUniqueFileName(file.name);
    const blob = bucket.file(uniqueName);
    const stream = blob.createWriteStream({
      resumable: false,
      metadata: { contentType: file.type },
    });
    stream.end(buffer);
    return await new Promise((resolve) => {
      stream.on("finish", async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        // Save file info to DB
        resolve(
          NextResponse.json({ url: publicUrl }, { status: 200 })
        );
      });
      stream.on("error", (err) => {
        console.error("GCS upload error:", err);
        resolve(NextResponse.json({ error: "Error uploading file to GCS" }, { status: 500 }));
      });
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Unexpected error during upload" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const { url: fileUrl } = await req.json();
    if (!fileUrl) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 });
    }
    const match = fileUrl.match(/https:\/\/storage\.googleapis\.com\/[^\/]+\/(.+)/);
    const filename = match ? match[1] : null;
    if (!filename) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }
    const file = bucket.file(filename);
    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json({ error: "File does not exist" }, { status: 404 });
    }
    await file.delete();
    // Remove from DB
    await File.deleteOne({ fileURL: fileUrl });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("GCS delete error:", err);
    return NextResponse.json({ error: "Error deleting file from GCS" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    let files;
    if (userId) {
      files = await File.find({ user: userId });
    } else {
      files = await File.find({});
    }
    return NextResponse.json(files, { status: 200 });
  } catch (err) {
    console.error("GCS get error:", err);
    return NextResponse.json({ error: "Error fetching files from DB" }, { status: 500 });
  }
}
