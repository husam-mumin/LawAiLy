import { bucket } from "../../dashboard/documents/file/_action/getfunction";
import { randomUUID } from "crypto";
import File from "@/models/Files";
import dbConnect from "@/lib/db";
import { extractTextFromGCS } from "./ocr/ocr";

export const config = {
  api: {
    bodyParser: false,
  },
};

function generateUniqueFileName(originalName: string): string {
  const ext = originalName.includes(".")
    ? "." + originalName.split(".").pop()
    : "";
  return `${Date.now()}-${randomUUID()}${ext}`;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(req: Request) {
  await dbConnect();
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return new Response("File too large. Max size is 2MB.", { status: 413 });
    }

    // upload to Google Cloud Storage
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
        const gcsUri = `gs://${bucket.name}/${blob.name}`;
        let extractedText = "";
        // OCR for images and PDFs
        if (file.type.startsWith("image/")) {
          extractedText = await extractTextFromGCS(publicUrl, "image");
        } else if (file.type === "application/pdf") {
          console.log("Processing PDF file for OCR");
          // Use GCS URI for PDF OCR
          extractedText = await extractTextFromGCS(
            gcsUri,
            "pdf",
            `gs://${bucket.name}/vision-output/`
          );
        } else {
          extractedText = "";
        }

        // check the extracted text
        if (!extractedText) {
          console.warn("No text extracted from the file.");
          return resolve(
            new Response("No text extracted from the file", {
              status: 400,
            })
          );
        }

        // Save file info to DB
        const fileDoc = await File.create({
          fileURL: publicUrl,
          filename: file.name,
          filesize: (file.size / 1024).toFixed(1) + " KB",
          fileformat: file.type,
          filetext: extractedText,
          message: formData.get("messageId") || undefined,
        });
        resolve(
          new Response(JSON.stringify({ id: fileDoc._id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        );
      });
      stream.on("error", (err) => {
        console.error("GCS upload error:", err);
        resolve(new Response("Error uploading file to GCS", { status: 500 }));
      });
    });
  } catch (err) {
    console.error("Upload error:", err);
    return new Response("Unexpected error during upload", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  try {
    const { url: fileUrl } = await req.json();
    if (!fileUrl) {
      return new Response("File URL is required", { status: 400 });
    }
    const match = fileUrl.match(
      /https:\/\/storage\.googleapis\.com\/[^\/]+\/(.+)/
    );
    const filename = match ? match[1] : null;
    if (!filename) {
      return new Response("Invalid file URL", { status: 400 });
    }
    const file = bucket.file(filename);
    const [exists] = await file.exists();
    if (!exists) {
      return new Response("File does not exist", { status: 404 });
    }
    await file.delete();
    // Remove from DB
    await File.deleteOne({ fileURL: fileUrl });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GCS delete error:", err);
    return new Response("Error deleting file from GCS", { status: 500 });
  }
}

export async function GET(req: Request) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const messageId = url.searchParams.get("messageId");
    let files;
    if (messageId) {
      files = await File.find({ message: messageId });
    } else {
      files = await File.find({});
    }
    return new Response(JSON.stringify(files), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GCS get error:", err);
    return new Response("Error fetching files from DB", { status: 500 });
  }
}
