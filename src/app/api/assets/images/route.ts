import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";
import * as dateFn from "date-fns";

export async function POST(request: NextRequest) {
  const formdata = await request.formData();
  const image = formdata.get("image") as File | null;

  if (!image) {
    return NextResponse.json(
      { success: false, message: "Image is required." },
      { status: 400 }
    );
  }

  /**
   * Upload file to cloudinary server
   */
  try {
    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadResult: any = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            filename_override: `${dateFn.format(Date.now(), "ddmmy-HHmmss")}`,
            use_filename: true,
            public_id: `${dateFn.format(Date.now(), "ddmmy-HHmmss")}`,
          },
          (error, uploadResult) => {
            if (error) {
              console.log(error);
            }
            return resolve(uploadResult);
          }
        )
        .end(buffer);
    });
    return NextResponse.json(
      { success: true, imageURL: uploadResult.url },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ success: false, message: error.message });
  }
}
