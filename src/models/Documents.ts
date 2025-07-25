/**
 * # Document 
 * 1. ID 
 * 2. DocumentURL 
 * 3. Title
 * 4. Description 
 * 5. showUp 
 * 6. createdAt 
 * 7. UpdateAt 
 * 8. AddedBy 
 * 
 **/

import mongoose, { Schema, Document } from 'mongoose';
import { userType } from './Users';
import { categoryType } from './Category';

export interface IDocument extends Document {
  documentURL: string;
  title: string;
  description: string;
  showUp: boolean;
  image: string,
  addedBy: Schema.Types.ObjectId;
  category?: Schema.Types.ObjectId;
}

export type documentType = {
  _id: string,
  createdAt: Date,
  documentURL: string,
  title: string,
  description: string,
  image: string,
  showUp: boolean,
  addedBy: userType,
  category?: categoryType 
}
const documentSchema: Schema = new mongoose.Schema<IDocument>({
  documentURL: { type: 'string', required: true },
  title: { type: 'string', required: true },
  description: { type: 'string', required: true },
  showUp: { type: 'boolean', default: true },
  image: { type: "string" },
  addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: false },
}, { timestamps: true });

const DocumentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', documentSchema);
export default DocumentModel;