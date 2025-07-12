import { Storage } from "@google-cloud/storage";

export const config = {
  api: {
    bodyParser: false,
  },
};
const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
  : undefined;

export const storage = new Storage({
  credentials: serviceAccount,
});
export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || ""); // Default to "lawai" if not set
