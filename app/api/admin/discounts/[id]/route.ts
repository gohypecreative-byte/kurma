import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { CURATED_MASTER_DISCOUNTS } from "@/components/admin/AdminDiscountsSection";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    let rawId = "";
    if (props && props.params) {
      try {
        const resolved = await Promise.resolve(props.params);
        rawId = resolved?.id || "";
      } catch { }
    }
    if (!rawId && req.url) {
      const pathname = new URL(req.url).pathname;
      const parts = pathname.split("/").filter(Boolean);
      rawId = parts[parts.length - 1] || "";
    }

    const id = decodeURIComponent(rawId).trim();
    if (!id) {
      return NextResponse.json({ error: "Discount ID is required" }, { status: 400 });
    }

    // 1. Check in database by ID or title
    const disc = await prisma.discount.findFirst({
      where: {
        OR: [
          { id },
          { title: { equals: id, mode: "insensitive" as const } },
        ],
      },
    });

    if (disc) {
      return NextResponse.json({ success: true, discount: disc });
    }

    // 2. Fallback to curated preset discounts
    const preset = CURATED_MASTER_DISCOUNTS.find(
      (p) =>
        p.id.toLowerCase() === id.toLowerCase() ||
        p.title.toUpperCase() === id.toUpperCase()
    );

    if (preset) {
      return NextResponse.json({ success: true, discount: preset });
    }

    return NextResponse.json({ error: "Discount not found" }, { status: 404 });
  } catch (error: any) {
    console.error("Error in GET /api/admin/discounts/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch discount" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    let rawId = "";
    if (props && props.params) {
      try {
        const resolved = await Promise.resolve(props.params);
        rawId = resolved?.id || "";
      } catch { }
    }
    if (!rawId && req.url) {
      const pathname = new URL(req.url).pathname;
      const parts = pathname.split("/").filter(Boolean);
      rawId = parts[parts.length - 1] || "";
    }

    const id = decodeURIComponent(rawId).trim();
    const body = await req.json();

    const {
      title,
      subtitle,
      status,
      used,
      method,
      eligibility,
      type,
      discountValue,
      minSpend,
      startDate,
      expiryDate,
      maxUses,
      productIds,
    } = body;

    const cleanTitle = title ? title.trim().toUpperCase() : undefined;

    const existing = await prisma.discount.findFirst({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          ...(cleanTitle ? [{ title: { equals: cleanTitle, mode: "insensitive" as const } }] : []),
        ],
      },
    });

    const updateData: any = {};
    if (cleanTitle) updateData.title = cleanTitle;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (status) updateData.status = status;
    if (used !== undefined) updateData.used = Number(used);
    if (method) updateData.method = method;
    if (eligibility) updateData.eligibility = eligibility;
    if (type) updateData.type = type;
    if (discountValue) updateData.discountValue = discountValue;
    if (minSpend !== undefined) updateData.minSpend = minSpend ? Number(minSpend) : null;
    if (startDate !== undefined) updateData.startDate = startDate || null;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate || null;
    if (maxUses !== undefined) updateData.maxUses = maxUses ? Number(maxUses) : null;
    if (Array.isArray(productIds)) updateData.productIds = productIds;

    let updated;
    if (existing) {
      updated = await prisma.discount.update({
        where: { id: existing.id },
        data: updateData,
      });
    } else {
      updated = await prisma.discount.create({
        data: {
          id: id || `disc-${Date.now()}`,
          title: cleanTitle || "PROMO",
          subtitle: subtitle || "Promotional coupon",
          status: status || "Active",
          method: method || "Code",
          eligibility: eligibility || "All customers",
          type: type || "Amount off order",
          used: used ? Number(used) : 0,
          discountValue: discountValue || "10%",
          minSpend: minSpend ? Number(minSpend) : null,
          startDate: startDate || null,
          expiryDate: expiryDate || null,
          maxUses: maxUses ? Number(maxUses) : null,
          productIds: Array.isArray(productIds) ? productIds : [],
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Discount "${updated.title}" updated successfully`,
      discount: updated,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/discounts/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update discount" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    let rawId = "";
    if (props && props.params) {
      try {
        const resolved = await Promise.resolve(props.params);
        rawId = resolved?.id || "";
      } catch { }
    }
    if (!rawId && req.url) {
      const pathname = new URL(req.url).pathname;
      const parts = pathname.split("/").filter(Boolean);
      rawId = parts[parts.length - 1] || "";
    }

    const id = decodeURIComponent(rawId).trim();
    if (!id) {
      return NextResponse.json({ error: "Discount ID is required" }, { status: 400 });
    }

    const existing = await prisma.discount.findFirst({
      where: {
        OR: [
          { id },
          { title: { equals: id, mode: "insensitive" as const } },
        ],
      },
    });

    if (existing) {
      await prisma.discount.delete({
        where: { id: existing.id },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Discount deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/discounts/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete discount" },
      { status: 500 }
    );
  }
}
