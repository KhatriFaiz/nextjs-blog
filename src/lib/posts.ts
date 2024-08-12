import { Post } from "@/mongoose/models/posts.model";
import { User } from "@/mongoose/models/users.model";

export async function getPosts() {
  try {
    const posts = await Post.find().populate("author");
    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostsByUsername(username: string) {
  try {
    const user = await User.findOne({ username });
    if (!user) return null;

    const post = await Post.find({ author: user?._id }).populate("author");
    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await Post.findOne({ slug });
    return post;
  } catch (error) {
    console.log(error);
  }
}
