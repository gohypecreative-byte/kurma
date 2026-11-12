import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const boxes = await prisma.customBox.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, customBoxes: boxes });
  } catch (error: any) {
    console.error("Error in GET /api/admin/custom-boxes:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch custom boxes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, size, capacity, price, image, description, active } = body;

    const id =
      body.id ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newBox = await prisma.customBox.create({
      data: {
        id,
        title: title.trim(),
        size: size || "8 x 8 x 4 cm",
        capacity: Number(capacity) || 4,
        price: Number(price) || 650,
        image: image || "/images/product/mdf-box-clean.png",
        description: description || "Artisanal keepsake box.",
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Custom box "${newBox.title}" added to Neon DB`,
      customBox: newBox,
    });
  } catch (error: any) {
    console.error("Error in POST /api/admin/custom-boxes:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create custom box" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, title, size, capacity, price, image, description, active } = body;

    if (!id) {
      return NextResponse.json({ error: "Custom Box ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (title) updateData.title = title.trim();
    if (size) updateData.size = size;
    if (capacity !== undefined) updateData.capacity = Number(capacity);
    if (price !== undefined) updateData.price = Number(price);
    if (image) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (active !== undefined) updateData.active = Boolean(active);

    const updated = await prisma.customBox.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Custom box "${updated.title}" updated`,
      customBox: updated,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/custom-boxes:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update custom box" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Custom Box ID is required" }, { status: 400 });
    }

    await prisma.customBox.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Custom box deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/custom-boxes:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete custom box" },
      { status: 500 }
    );
  }
}

