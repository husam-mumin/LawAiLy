import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  response: mongoose.Types.ObjectId;
  likedAt: Date;
}

export interface LikeType {
  user: string;
  response: string;
  likedAt: Date;
}

const LikeSchema: Schema = new mongoose.Schema<ILike>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  response: { type: Schema.Types.ObjectId, ref: 'response', required: true },
  likedAt: { type: Date, default: Date.now },
});

const Like = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);

export default Like;
