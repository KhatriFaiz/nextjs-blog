import { Post } from "@/mongoose/models/posts.model";

export async function getPosts() {
  const posts = await Post.find().populate("author");
  return posts;
}
