import mongoose, { Schema, Document, Model } from "mongoose";

export interface NewsType extends Document {
  _id: string;
  user?: mongoose.Types.ObjectId; // Optional: for notifications
  title: string;
  content?: string; // For notifications
  createdAt: Date;
}

const NewsSchema = new Schema<NewsType>({
  user: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  title: { type: String, required: true },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const News =
  (mongoose.models.News as Model<NewsType>) ||
  mongoose.model<NewsType>("News", NewsSchema);

export default News;
