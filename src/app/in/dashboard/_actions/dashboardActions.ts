import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import DocumentModel from "@/models/Documents";
import Message from "@/models/Messages";
import Response from "@/models/Responses";
import ShareResponse from "@/models/ShareResponse";

export async function getDashboardStats() {
  await dbConnect();
  const totalCategories = await Category.countDocuments();
  const totalBooks = await DocumentModel.countDocuments();
  const totalMessages = await Message.countDocuments();
  const totalResponses = await Response.countDocuments();
  const totalShares = await ShareResponse.countDocuments();
  const totalLike = await Response.countDocuments({
    isGood: true,
  });

  return {
    totalCategories,
    totalBooks,
    totalMessages,
    totalResponses,
    totalShares,
    totalLike,
  };
}

export async function getLibyaLawCategories() {
  await dbConnect();
  // Get all categories and populate with books (documents)
  interface CategoryType {
    _id: string;
    name: string;
    // add other fields if needed
  }

  const rawCategories = await Category.find().lean();
  const categories: CategoryType[] = rawCategories.map((cat) => ({
    _id: cat._id?.toString() ?? "",
    name: cat.name ?? "",
    // add other fields if needed
  }));
  const books = await DocumentModel.find().lean();
  // Attach books to each category
  const categoriesWithBooks = categories.map((cat) => ({
    ...cat,
    books: books.filter((b) => b.category?.toString() === cat._id.toString()),
  }));
  console.log(books);

  // Add uncategorized books
  const uncategorizedBooks = books.filter((b) => !b.category);
  if (uncategorizedBooks.length > 0) {
    categoriesWithBooks.push({
      _id: "uncategorized",
      name: "غير مصنف",
      books: uncategorizedBooks,
    });
  }
  return categoriesWithBooks;
}
