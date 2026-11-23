import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body?.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: true, validatedItems: [] });
    }

    // Extract product / SKU IDs
    const skuIds = items
      .map((it: any) => it.skuId || it.id)
      .filter((id: any): id is string => typeof id === "string" && Boolean(id));

    let dbProducts: any[] = [];
    try {
      dbProducts = await prisma.product.findMany({
        where: { id: { in: skuIds } },
      });
    } catch (err) {
      console.warn("Could not query DB products for cart validation:", err);
    }

    const dbMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Match each cart item against database product records
    const validatedItems = items.map((it: any) => {
      const match = dbMap.get(it.skuId || it.id);
      if (match) {
        return {
          ...it,
          name: match.name || it.name,
          price: match.price ?? it.price,
          image: it.image || match.image,
          inStock: match.inStock ?? true,
        };
      }
      return it;
    });

    return NextResponse.json({ success: true, validatedItems });
  } catch (err: any) {
    console.error("Cart validation error:", err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
