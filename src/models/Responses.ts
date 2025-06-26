/**
 * # Response
 * 1. ID
 * 2. Response
 * 3. message
 * 4. Chat
 * 5. CreateAt
 * 6. isGood
 * 
 */

import mongoose, { Schema, Document} from "mongoose"; 

export interface IResponse extends Document {
  response: string, 
  message: mongoose.Types.ObjectId,
  chat: mongoose.Types.ObjectId,
  isGood: boolean | null,
}

export type responseType = {
  _id: string,
  response: string, 
  message: string,
  chat: string,
  isGood: boolean | null,
}

const responseSchema: Schema = new  mongoose.Schema<IResponse>({
  response: {type: 'string', required: true},
  message: {type: 'ObjectID', ref: "Message", required: true},
  chat: { type: 'ObjectID', required: true},
  isGood: { type: 'boolean', required: false , default: null}

})

const Response = mongoose.models.response || mongoose.model<IResponse>('response', responseSchema);

export default Response;