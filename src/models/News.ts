import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INews extends Document {
  user: Types.ObjectId; // Reference to the user
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NewsSchema: Schema = new Schema<INews>({
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
