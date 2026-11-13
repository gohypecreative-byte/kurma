import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

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
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

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
      featured,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const id =
      body.id?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `product-${Date.now()}`;

    const productData = {
      name: name.trim(),
      subtitle: subtitle?.trim() || "Sacred Creation",
      category: category || "Gift Boxes",
      price: Math.max(0, Number(price) || 999),
      originalPrice: originalPrice ? Math.max(0, Number(originalPrice)) : null,
      stock: stock !== undefined ? Math.max(0, Number(stock)) : 25,
      image: image || "/images/product/mdf-box-clean.png",
      gallery: Array.isArray(gallery) ? gallery : [],
      badge: badge ? String(badge) : null,
      description: description?.trim() || "Artisanal Kurma handcrafted creation.",
      details: Array.isArray(details) && details.length > 0
        ? details
        : ["Sacred artisanal craftsmanship"],
      elements: Array.isArray(elements) ? elements : [],
      featured: Boolean(featured),
      inStock: stock !== undefined ? Number(stock) > 0 : true,
    };

    const product = await prisma.product.upsert({
      where: { id },
      update: productData,
      create: {
        id,
        ...productData,
        rating: 5.0,
        reviewCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Product "${product.name}" saved successfully to database`,
      product,
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
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const {
      id,
      stock,
      price,
      originalPrice,
      name,
      subtitle,
      category,
      description,
      image,
      gallery,
      badge,
      details,
      elements,
      inStock,
      featured,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (stock !== undefined) {
      updateData.stock = Math.max(0, Number(stock));
      if (inStock === undefined) {
        updateData.inStock = Number(stock) > 0;
      }
    }
    if (price !== undefined) updateData.price = Math.max(0, Number(price));
    if (originalPrice !== undefined) {
      updateData.originalPrice = originalPrice ? Math.max(0, Number(originalPrice)) : null;
    }
    if (name !== undefined) updateData.name = String(name).trim();
    if (subtitle !== undefined) updateData.subtitle = String(subtitle).trim();
    if (category !== undefined) updateData.category = String(category);
    if (description !== undefined) updateData.description = String(description).trim();
    if (image !== undefined) updateData.image = String(image);
    if (gallery !== undefined && Array.isArray(gallery)) updateData.gallery = gallery;
    if (badge !== undefined) updateData.badge = badge ? String(badge) : null;
    if (details !== undefined && Array.isArray(details)) updateData.details = details;
    if (elements !== undefined && Array.isArray(elements)) updateData.elements = elements;
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (featured !== undefined) updateData.featured = Boolean(featured);

    const updated = await prisma.product.upsert({
      where: { id },
      update: updateData,
      create: {
        id,
        name: updateData.name || id,
        subtitle: updateData.subtitle || "Sacred Creation",
        category: updateData.category || "Gift Boxes",
        price: updateData.price || 999,
        originalPrice: updateData.originalPrice || null,
        stock: updateData.stock ?? 25,
        image: updateData.image || "/images/product/mdf-box-clean.png",
        gallery: updateData.gallery || [],
        badge: updateData.badge || null,
        description: updateData.description || "Artisanal Kurma handcrafted creation.",
        details: updateData.details || ["Sacred artisanal craftsmanship"],
        elements: updateData.elements || [],
        inStock: updateData.inStock ?? true,
        featured: updateData.featured ?? false,
        rating: 5.0,
        reviewCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Product "${updated.name}" updated in database`,
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
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if product exists before attempting delete
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (existing) {
      await prisma.product.delete({
        where: { id },
      });
    }

    return NextResponse.json({
      success: true,
      message: existing
        ? `Product "${existing.name}" removed from database`
        : `Product "${id}" removed from catalog`,
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/products:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
