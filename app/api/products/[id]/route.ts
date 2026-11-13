import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS, ProductSKU } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const normalizedId = id.replace(/^fragance-/, "fragrance-");

    const p = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { id: normalizedId }],
      },
    });

    const staticItem = PRODUCTS.find(
      (item) => item.id === id || item.id === normalizedId
    );

    if (p) {
      const product: ProductSKU = {
        id: p.id,
        name: p.name,
        subtitle: p.subtitle,
        category: p.category as any,
        price: p.price,
        originalPrice: p.originalPrice ?? undefined,
        image: p.image,
        gallery: p.gallery && p.gallery.length > 0 ? p.gallery : staticItem?.gallery,
        badge: p.badge ?? undefined,
        description: p.description,
        details: p.details && p.details.length > 0 ? p.details : (staticItem?.details ?? []),
        elements: p.elements && p.elements.length > 0 ? p.elements : (staticItem?.elements ?? []),
        customizationFields: staticItem?.customizationFields ?? [],
      };

      return NextResponse.json(
        { success: true, product, source: "database" },
        {
          headers: {
            "Cache-Control": "no-store, max-age=0, must-revalidate",
          },
        }
      );
    }

    if (staticItem) {
      return NextResponse.json(
        { success: true, product: staticItem, source: "fallback" },
        {
          headers: {
            "Cache-Control": "no-store, max-age=0, must-revalidate",
          },
        }
      );
    }

    return NextResponse.json(
      { error: `Product "${id}" not found` },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/products/[id]:", error);
    const { id } = await params;
    const staticItem = PRODUCTS.find((p) => p.id === id);
    if (staticItem) {
      return NextResponse.json({ success: true, product: staticItem, source: "fallback-on-error" });
    }
    return NextResponse.json(
      { error: error?.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

