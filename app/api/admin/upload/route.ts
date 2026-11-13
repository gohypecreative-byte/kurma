import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const contentType = req.headers.get("content-type") || "";
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Ensure upload directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    let buffer: Buffer;
    let extension = "png";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);

      const originalName = file.name || "image.png";
      const ext = path.extname(originalName).replace(".", "").toLowerCase();
      if (["png", "jpg", "jpeg", "webp", "svg", "gif"].includes(ext)) {
        extension = ext;
      }
    } else {
      // Support JSON base64 data URL: { image: "data:image/png;base64,..." }
      const body = await req.json();
      const dataUrl = body.image || body.file;

      if (!dataUrl || typeof dataUrl !== "string") {
        return NextResponse.json({ error: "No image data provided" }, { status: 400 });
      }

      const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        const mimeSubtype = match[1].toLowerCase();
        extension = mimeSubtype === "jpeg" ? "jpg" : mimeSubtype;
        buffer = Buffer.from(match[2], "base64");
      } else {
        return NextResponse.json({ error: "Invalid image data format" }, { status: 400 });
      }
    }

    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const filename = `product-${uniqueSuffix}.${extension}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      message: "Image uploaded and stored successfully",
    });
  } catch (error: any) {
    console.error("Error in POST /api/admin/upload:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}

