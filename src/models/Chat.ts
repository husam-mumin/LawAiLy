/**
 * # Chat 
 * 1. ID
 * 2.title
 * 3. isFavorite
 * 3.CreateAt
 * 4.UpdateAt
 */

import mongoose, { Document, Schema} from "mongoose";
import { messageType } from "./Messages";

export interface IChat extends Document {
  title: string,
  messages: messageType[],
  isFavorite: boolean,
  users: Schema.Types.ObjectId[],
}

export type chatType = {
  title: string,
  messages: messageType[],
  isFavorite: boolean,
  users: string
}

const chatSchema: Schema = new mongoose.Schema<IChat>({
  title: { type: 'string', required: true },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: []
    }
  ],
  isFavorite: { type: 'boolean', default: false },
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }]
}, { timestamps: true });

const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema);
export default Chat;