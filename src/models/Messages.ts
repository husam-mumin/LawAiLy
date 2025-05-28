/**
 * # Messages 
 * 1. ID
 * 2. Message
 * 3. User
 * 4. Chat
 * 5. CreateAt
 * 6. Responses
 * 7. Files
 */

import mongoose, { Document,  Schema } from "mongoose"
import { fileType } from "./Files"
import { responseType } from "./Responses"

export  interface IMessage extends Document {
  message: string,
  users: Schema.Types.ObjectId,
  chat: Schema.Types.ObjectId,
  responses: Schema.Types.ObjectId[]
  files: Schema.Types.ObjectId[]
}

export type messageType = {

  message: string,
  users: string,
  chat: string,
  responses: responseType[]
  files: fileType[]
}

const messagesSchema: Schema = new mongoose.Schema<IMessage>({
  message: { type: 'string', required: true},
  users: { type: Schema.Types.ObjectId, ref: "User" , required: true},
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true},
  responses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Response",
      default: []
    }
  ],

  files: [
    {
      type: Schema.Types.ObjectId,
      ref: "Files",
      default: []
    }
  ]
}
  , 
  { timestamps: true}
);

const Message = mongoose.models?.Message || mongoose.model<IMessage>('Message', messagesSchema)

export default Message