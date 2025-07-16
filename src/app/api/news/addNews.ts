import dbConnect from "@/lib/db";
import News from "@/models/New";
import NewsUser from "@/models/NewsUser";
import User from "@/models/Users";

export default async function newNewsAction(title: string, content: string) {
  try {
    await dbConnect();
    if (!title || !content) {
      return false;
    }
    // Create the news item
    const news = await News.create({ title, content });
    // Get all users
    const users = await User.find({}, "_id");
    // Create a notification for each user
    const notifications = users.map((user: { _id: string }) => ({
      user: user._id,
      read: false,
      new: news._id.toString(), // Ensure news ID is a string
    }));
    // Insert notifications in bulk
    await NewsUser.insertMany(notifications);

    return news;
  } catch {
    return false;
  }
}
