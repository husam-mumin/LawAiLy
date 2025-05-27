/**
 * # Chat 
 * 1. ID
 * 2.title
 * 3. isFavorite
 * 3.CreateAt
 * 4.UpdateAt
 */

import mongoose, { Document, Schema} from "mongoose";

export interface IChat extends Document {
  title: string,
  isFavorite: boolean,
  users: Schema.Types.ObjectId[],
}

const chatSchema: Schema = new mongoose.Schema<IChat>({
  title: { type: 'string', required: true },
  isFavorite: { type: 'boolean', default: false },
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }]
}, { timestamps: true });

const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema);
export default Chat;