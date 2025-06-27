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