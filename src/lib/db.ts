import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

import "@/models/Category";
import "@/models/Chat";
import "@/models/Documents";
import "@/models/Files";
import "@/models/Messages";
import "@/models/New";
import "@/models/NewsUser";
import "@/models/Reporting";
import "@/models/Responses";
import "@/models/ShareResponse";
import "@/models/Users";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

declare global {
  // Allow global mongoose cache in development
  var mongooseConnection:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

const globalCache = globalThis.mongooseConnection ?? {
  conn: null,
  promise: null,
};

async function dbConnect(): Promise<Mongoose> {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  globalCache.conn = await globalCache.promise;
  globalThis.mongooseConnection = globalCache;

  return globalCache.conn;
}

export default dbConnect;
