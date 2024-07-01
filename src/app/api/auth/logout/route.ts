import { connectDatabase } from "@/mongoose/connection";
import { User } from "@/mongoose/models/users.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(request: Request) {
  await connectDatabase();

  // Get access token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  // Check if token is present in cookie
  if (!token?.value) {
    return NextResponse.json(
      {
        success: false,
        message: `Invalid token.`,
      },
      {
        status: 400, // Bad request
      }
    );
  }

  // check if access token secret is available in env
  if (!process.env.ACCESS_TOKEN_SECRET) {
    return NextResponse.json(
      {
        success: false,
        message: `Token validation failed.`,
      },
      {
        status: 500,
      }
    );
  }

  // Validate JWT
  const decodedJWT = jwt.verify(
    token?.value,
    process.env.ACCESS_TOKEN_SECRET
  ) as JwtPayload;
  const userid = decodedJWT.id;

  // Delete JWT from database
  await User.findByIdAndUpdate(userid, {
    $unset: { accessToken: 1 },
  });

  //Delete cookie
  cookieStore.delete("token");

  return new Response(null, {
    status: 204,
  });
}
