import { connectDatabase } from "@/mongoose/connection";
import { Post } from "@/mongoose/models/posts.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyUser } from "@/lib/auth";

export async function GET() {
  await connectDatabase();
  const posts = await Post.find();
  return NextResponse.json({
    data: posts,
  });
}

const BlogSchema = z.object({
  title: z.string(),
  content: z.string(),
  author: z.string({ message: "Author is required." }),
});

export async function POST(request: Request) {
  // Validate user
  const cookieStore = cookies();
  const user = verifyUser(cookieStore);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: `Unauthorized request.`,
      },
      {
        status: 401, // Bad request
      }
    );
  }

  await connectDatabase();
  const body = await request.json();

  // Validate body
  const validateBody = BlogSchema.safeParse(body);
  if (!validateBody.success) {
    return NextResponse.json(
      {
        success: false,
        error: validateBody.error,
      },
      {
        status: 400, // Bad request
      }
    );
  }

  try {
    const post = new Post({
      title: body.title,
      content: body.content,
      author: user.id,
    });
    const savedPost = await post.save();
    return NextResponse.json(
      {
        success: true,
        data: savedPost,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Some error",
        },
        {
          status: 400, // Bad request
        }
      );
    }
  }
}
