import { connectDatabase } from "@/mongoose/connection";
import { User } from "@/mongoose/models/users.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDatabase();
  const body = await request.json();

  // Check if all required properties are present in the request body
  const requiredProperties = ["name", "email", "username", "password"];
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

  // Register new user
  const registeredUser = await User.registerUser(body);

  // Filter `registerdUser` to send only allowed fields
  const allowedFields = ["name", "email", "username", "_id"];
  const user: any = {};
  for (const key of allowedFields) {
    user[key] = registeredUser[key as keyof typeof registeredUser];
  }

  // Generate JWT to start session
  const accessToken = registeredUser.generateAccessToken();
  await User.findByIdAndUpdate(registeredUser._id, {
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

  return NextResponse.json(
    {
      success: true,
      message: "User registered successful.",
      user,
    },
    {
      status: 201,
    }
  );
}
