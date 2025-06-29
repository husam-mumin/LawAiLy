import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
}

export type categoryType = {
  _id: string;
  name: string;
  description?: string;
  count?: number; // Optional count for UI purposes
};

const categorySchema: Schema = new mongoose.Schema<ICategory>({
  name: { type: "string", required: true, unique: true },
  description: { type: "string" },
});

const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);
export default Category;
