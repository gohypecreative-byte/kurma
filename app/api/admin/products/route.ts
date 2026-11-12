import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    const inventoryStock: Record<string, number> = {};
    for (const p of products) {
      inventoryStock[p.id] = p.stock;
    }

    return NextResponse.json({
      success: true,
      products,
      inventoryStock,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/products:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      subtitle,
      category,
      price,
      originalPrice,
      stock,
      image,
      gallery,
      badge,
      description,
      details,
      elements,
    } = body;

    const id =
      body.id ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newProduct = await prisma.product.create({
      data: {
        id,
        name: name.trim(),
        subtitle: subtitle?.trim() || "Sacred Creation",
        category: category || "Gift Boxes",
        price: Number(price) || 999,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        stock: stock !== undefined ? Number(stock) : 25,
        image: image || "/images/product/mdf-box-clean.png",
        gallery: gallery || [],
        badge: badge || null,
        description: description || "Artisanal Kurma handcrafted creation.",
        details: details || ["Sacred artisanal craftsmanship"],
        elements: elements || [],
        inStock: true,
        rating: 5.0,
        reviewCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Product "${newProduct.name}" created successfully in Neon DB`,
      product: newProduct,
    });
  } catch (error: any) {
    console.error("Error in POST /api/admin/products:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, stock, price, originalPrice, name, subtitle, category, description, image, inStock } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (stock !== undefined) updateData.stock = Number(stock);
    if (price !== undefined) updateData.price = Number(price);
    if (originalPrice !== undefined) updateData.originalPrice = Number(originalPrice);
    if (name) updateData.name = name.trim();
    if (subtitle) updateData.subtitle = subtitle.trim();
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (image) updateData.image = image;
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Product "${updated.name}" updated`,
      product: updated,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/products:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product removed from catalog",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/products:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

