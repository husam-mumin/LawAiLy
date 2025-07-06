import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import DocumentModel from "@/models/Documents";
import Message from "@/models/Messages";
import Response from "@/models/Responses";
import Like from "@/models/Like";
import ShareResponse from "@/models/ShareResponse";

export async function getDashboardStats() {
  await dbConnect();
  const totalCategories = await Category.countDocuments();
  const totalBooks = await DocumentModel.countDocuments();
  const totalMessages = await Message.countDocuments();
  const totalResponses = await Response.countDocuments();
  const totalLikes = await Like.countDocuments();
  const totalShares = await ShareResponse.countDocuments();
  return {
    totalCategories,
    totalBooks,
    totalMessages,
    totalResponses,
    totalLikes,
    totalShares,
  };
}

export async function getLibyaLawCategories() {
  await dbConnect();
  // Get all categories and populate with books (documents)
  const categories = await Category.find().lean() ;
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
      _id: 'uncategorized',
      name: 'غير مصنف',
      books: uncategorizedBooks,
    });
  }
  return categoriesWithBooks;
}
