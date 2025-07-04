/**
 * 
 * Report for a Response 
 * ID
 * Response ID
 * User ID
 * Message
 * 
 */

import mongoose, { Schema,Document } from "mongoose";
import { userType } from "./Users";
import { responseType } from "./Responses";

export interface IResponseReport extends Document {
  user: mongoose.Types.ObjectId;
  response: mongoose.Types.ObjectId;
  message: string
}

export interface responseReportType {
  user: userType, 
  responseId: responseType;
  message: string
}

const ResponseReportSchema: Schema = new mongoose.Schema<IResponseReport>({
  user: { type: 'ObjectID', ref: 'User', required: true},
  response: { type: 'ObjectId', ref: "response", required: true},
  message: { type: 'string'}
})

const ResponseReport = mongoose.models.responseReport || mongoose.model<IResponseReport>('responseReport', ResponseReportSchema)

export default ResponseReport;