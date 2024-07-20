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

  const requiredProperties = ["title", "content"];
  for (const property of requiredProperties) {
    if (!(property in body))
      return NextResponse.json(
        {
          success: false,
          message: `${property} is required.`,
        },
        {
          status: 400, // Bad request
        }
      );
  }

  const post = new Post({ title: body.title, content: body.content });
  const savedPost = await post.save();

  return NextResponse.json(
    {
      success: true,
      data: savedPost,
    },
    { status: 201 }
  );
}
