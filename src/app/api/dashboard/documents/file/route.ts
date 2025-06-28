import { Storage } from "@google-cloud/storage";

export const config = {
  api: {
    bodyParser: false,
  },
}

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || "./service-account.json",
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || "lawai"); // Default to "lawai" if not set

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  const blob = bucket.file(file.name);

  const [exists] = await blob.exists();
  if (exists) {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    return new Response(JSON.stringify({ url: publicUrl }), {
      status: 409,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const stream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.type,
    }});

    stream.end(buffer);

    return new Promise(( resolve) => {
      stream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(new Response(JSON.stringify({ url: publicUrl }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }))});
        stream.on("error", (err) => {
        console.error("GCS upload error:", err);
        resolve(new Response("Error uploading file to GCS", { status: 500 }));
    })
  })


}

export async function DELETE(req: Request) {
  try {

    const { url } = await req.json();

    if (!url) {
      return new Response("File URL is required", { status: 400 });
    }

    // Extract the object path from the public URL
    // Example: https://storage.googleapis.com/bucket-name/folder/file.pdf
    const match = url.match(/https:\/\/storage\.googleapis\.com\/[^\/]+\/(.+)/);
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