/**
 * # Messages 
 * 1. ID
 * 2. Message
 * 3. User
 * 4. Chat
 * 5. createdAt
 * 6. Responses
 * 7. Files
 */

import mongoose, { Document,  Schema } from "mongoose"
import { fileType } from "./Files"
import { responseType } from "./Responses"

export  interface IMessage extends Document {
  message: string,
  user: Schema.Types.ObjectId,
  chat: Schema.Types.ObjectId,
  response: Schema.Types.ObjectId
  files: Schema.Types.ObjectId[]
}

export type messageType = {
  _id: string,
  message: string,
  user: string,
  chat: string,
  response: responseType
  files: fileType[]
}

const messagesSchema: Schema = new mongoose.Schema<IMessage>({
  message: { type: 'string', required: true},
  user: { type: Schema.Types.ObjectId, ref: "User" , required: true},
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true},
  response: 
    {
      type: Schema.Types.ObjectId,
      ref: "Response",
      default: null
    }
  ,

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