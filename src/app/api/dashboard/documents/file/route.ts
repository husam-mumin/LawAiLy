import { randomUUID } from "crypto";
import { bucket } from "./_action/getfunction";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to generate a unique file name, preserving extension
function generateUniqueFileName(originalName: string): string {
  const ext = originalName.includes('.') ? '.' + originalName.split('.').pop() : '';
  return `${Date.now()}-${randomUUID()}${ext}`;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueName = generateUniqueFileName(file.name);
  const blob = bucket.file(uniqueName);

  const stream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.type,
    },
  });

  stream.end(buffer);

  return new Promise((resolve) => {
    stream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(
        new Response(JSON.stringify({ url: publicUrl }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });
    stream.on("error", (err) => {
      console.error("GCS upload error:", err);
      resolve(new Response("Error uploading file to GCS", { status: 500 }));
    });
  });
}

export async function DELETE(req: Request) {
  try {
    const { url: fileUrl } = await req.json();

    if (!fileUrl) {
      return new Response("File URL is required", { status: 400 });
    }

    // Extract the object path from the public URL
    // Example: https://storage.googleapis.com/bucket-name/folder/file.pdf
    const match = fileUrl.match(/https:\/\/storage\.googleapis\.com\/[^\/]+\/(.+)/);
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("GCS delete error:", err);
    return new Response("Error deleting file from GCS", { status: 500 });
  }
}