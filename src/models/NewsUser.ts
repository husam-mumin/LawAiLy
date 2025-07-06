import mongoose, { Schema, Document, Types } from 'mongoose';
import { NewsType } from './New';
import { userType } from './Users';

export interface INewsUser extends Document {
  user: Types.ObjectId; // Reference to the user
  new: string;
  isRead: boolean;
  createdAt: Date;
}

export type NewsUserType = {
  _id: string;
  new: NewsType;
  user: userType; // User ID as a string
  isRead: boolean;
  createdAt: string; // ISO date string
};

const NewsSchema: Schema = new Schema<INewsUser>({
  new : { type: String, ref: "News", required: true },
  isRead: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.NewsUser || mongoose.model<INewsUser>('NewsUser', NewsSchema);
