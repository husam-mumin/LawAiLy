import mongoose, { Schema, Document } from "mongoose";

export interface IShareResponse extends Document {
  user: mongoose.Types.ObjectId;
  response: mongoose.Types.ObjectId;
  sharedAt: Date;
}

export interface ShareResponseType {
  user: string;
  response: string;
  sharedAt: Date;
}

const ShareResponseSchema: Schema = new mongoose.Schema<IShareResponse>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  response: { type: Schema.Types.ObjectId, ref: 'response', required: true },
  sharedAt: { type: Date, default: Date.now },
});

const ShareResponse = mongoose.models.ShareResponse || mongoose.model<IShareResponse>('ShareResponse', ShareResponseSchema);

export default ShareResponse;
