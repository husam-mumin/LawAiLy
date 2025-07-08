import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category, { categoryType } from "@/models/Category";
import DocumentModel from "@/models/Documents";

export type GETCategoryType = {
  success: boolean,
  data: categoryType & { count : number}
}
export async function GET() {
  await dbConnect();
  try {
    const Categories: categoryType[] = await Category.find();
    return NextResponse.json({ success: true, data: Categories });

  } catch {
    return NextResponse.json({ success: false, error: "فشل في جلب المستندات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const doc = await Category.create(body);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error ).name === "ValidationError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "فشل في إنشاء المستند" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { _id, ...updates } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: "معرف المستند مفقود" }, { status: 400 });
    }
    const updated = await Category.findByIdAndUpdate(_id, updates, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على المستند" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof Error && (error ).name === "ValidationError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "فشل في تحديث المستند" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json({ success: false, error: "معرف المستند مفقود" }, { status: 400 });
    }
    // Remove category reference from all documents before deleting the category
    const deleted = await Category.findByIdAndDelete(_id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على المستند" }, { status: 404 });
    }
      DocumentModel.updateMany({ category: _id }, { $set: { category: null } })
    return NextResponse.json({ success: true, data: deleted });
  } catch {
    return NextResponse.json({ success: false, error: "فشل في حذف المستند" }, { status: 500 });
  }
}
