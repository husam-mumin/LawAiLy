import { Storage } from "@google-cloud/storage";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const storage = new Storage({
  keyFilename:
    process.env.GOOGLE_APPLICATION_CREDENTIALS || "./service-account.json",
});
export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || ""); // Default to "lawai" if not set
