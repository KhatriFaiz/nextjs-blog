import { connectDatabase } from "@/mongoose/connection";
import { User } from "@/mongoose/models/users.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDatabase();
  const body = await request.json();

  // Check if all required properties are present in the request body
  const requiredProperties = ["email", "password"];
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

  // validate user
  const user = await User.findOne({
    email: body.email,
  });
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: `Invalid credentials`,
      },
      {
        status: 401, // Bad request
      }
    );
  }

  // Validate Password
  const isPasswordCorrect = await user.isPasswordCorrect(body.password);
  if (!isPasswordCorrect) {
    return NextResponse.json(
      {
        success: false,
        message: `Invalid credentials`,
      },
      {
        status: 401, // Bad request
      }
    );
  }

  // Generate JWT to start session
  const accessToken = user.generateAccessToken();
  await User.findByIdAndUpdate(user._id, {
    accessToken,
  });

  // Set access token in cookies
  const cookieStore = cookies();
  cookieStore.set("token", accessToken, {
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  // Filter `user` to send only allowed fields
  const allowedFields = ["name", "email", "username", "_id"];
  const loggedInUser: any = {};
  for (const key of allowedFields) {
    loggedInUser[key] = user[key as keyof typeof user];
  }

  return NextResponse.json(
    {
      success: true,
      message: "Login successful.",
      user: loggedInUser,
    },
    {
      status: 201,
    }
  );
}
