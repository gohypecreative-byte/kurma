import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS, ProductSKU } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      // Map and merge with any static customization fields if matched by ID
      const staticMap = new Map<string, ProductSKU>(
        PRODUCTS.map((p) => [p.id, p])
      );

      const products: ProductSKU[] = dbProducts.map((p) => {
        const staticItem = staticMap.get(p.id);
        return {
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
      });

      return NextResponse.json(
        {
          success: true,
          products,
          count: products.length,
          source: "database",
        },
        {
          headers: {
            "Cache-Control": "no-store, max-age=0, must-revalidate",
          },
        }
      );
    }

    // Fallback if database is empty
    return NextResponse.json(
      {
        success: true,
        products: PRODUCTS,
        count: PRODUCTS.length,
        source: "fallback",
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Error in GET /api/products:", error);
    // Graceful fallback to static PRODUCTS if DB throws
    return NextResponse.json(
      {
        success: true,
        products: PRODUCTS,
        count: PRODUCTS.length,
        source: "fallback-on-error",
        error: error?.message,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  }
}

