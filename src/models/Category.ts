import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  count?: number;
  description?: string;
}

export type categoryType = {
  _id: string;
  name: string;
  description?: string;
  count?: number;
};

const categorySchema: Schema = new mongoose.Schema<ICategory>({
  name: { type: "string", required: true, unique: true },
  description: { type: "string" },
  count: { type: "number", required: false, default: 0 },
});

const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);
export default Category;
