import { connectDatabase } from "@/mongoose/connection";
import { Post } from "@/mongoose/models/posts.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDatabase();

  const posts = await Post.find();

  return NextResponse.json({
    data: posts,
  });
}

export async function POST(request: Request) {
  await connectDatabase();
  const body = await request.json();
  const post = new Post({
    title: body.title,
  });
  const savedPost = await post.save();

  return NextResponse.json({
    data: savedPost,
  });
}
