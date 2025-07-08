/**
 * # Chat 
 * 1. ID
 * 2.title
 * 3. isFavorite
 * 3.createdAtt
 * 4.UpdateAt
 */

import mongoose, { Document, Schema} from "mongoose";
import { messageType } from "./Messages";

export interface IChat extends Document {
  title: string,
  messages: messageType[],
  isFavorite: boolean,
  user: Schema.Types.ObjectId,
}

export type chatType = {
  _id: string,
  title: string,
  messages: messageType[],
  isFavorite: boolean,
  user: string,
  createdAt?: string | Date // Added createdAt for date grouping
}

const chatSchema: Schema = new mongoose.Schema<IChat>({
  title: { type: 'string', required: true },
  isFavorite: { type: 'boolean', default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema);
export default Chat;