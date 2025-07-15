/**
 * # Files
 * 1. ID
 * 2. createdAt
 * 3. FileURL
 * 4. FileText
 * 5. MessageID
 *
 */

import mongoose, { Document, Schema } from "mongoose";

export interface IFile extends Document {
  fileURL: string;
  filename: string;
  filesize: string;
  fileformat: string;
  filetext: string;
}

export type fileType = {
  fileURL: string;
  filename: string;
  filesize: string;
  fileformat: string;
  filetext: string;
};

const fileSchema: Schema = new mongoose.Schema<IFile>(
  {
    fileURL: { type: "string", required: true },
    filename: { type: "string", required: true },
    filesize: { type: "string", required: true },
    fileformat: { type: "string", requried: true },
    filetext: { type: "string", required: true },
  },
  { timestamps: true }
);

const File = mongoose.models.File || mongoose.model<IFile>("File", fileSchema);

export default File;
