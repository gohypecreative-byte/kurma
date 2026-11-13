import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("Error in GET /api/admin/categories:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { title, slug, description, image, badge, targetRevenue, channels } = body;

    const cleanSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newCat = await prisma.category.create({
      data: {
        id: `cat-${Date.now()}`,
        title: title.trim(),
        slug: cleanSlug,
        description: description || "",
        image: image || "/images/product/mdf-box-clean.png",
        badge: badge || null,
        targetRevenue: Number(targetRevenue) || 50000,
        channels: channels || ["Online Storefront"],
        productCount: 0,
        visible: true,
        salesProgress: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Category "${newCat.title}" created`,
      category: newCat,
    });
  } catch (error: any) {
    console.error("Error in POST /api/admin/categories:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { id, title, description, targetRevenue, visible } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (targetRevenue !== undefined) updateData.targetRevenue = Number(targetRevenue);
    if (visible !== undefined) updateData.visible = Boolean(visible);

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/categories:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/categories:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}

