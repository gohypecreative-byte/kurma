import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { CURATED_MASTER_DISCOUNTS } from "@/components/admin/AdminDiscountsSection";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(req.url);
    const queryId = searchParams.get("id");

    if (queryId) {
      const cleanId = queryId.trim();
      const disc = await prisma.discount.findFirst({
        where: {
          OR: [
            { id: cleanId },
            { title: { equals: cleanId, mode: "insensitive" as const } },
          ],
        },
      });

      if (disc) {
        return NextResponse.json({ success: true, discount: disc });
      }

      // Check fallback curated presets
      const preset = CURATED_MASTER_DISCOUNTS.find(
        (p) =>
          p.id.toLowerCase() === cleanId.toLowerCase() ||
          p.title.toUpperCase() === cleanId.toUpperCase()
      );

      if (preset) {
        return NextResponse.json({ success: true, discount: preset });
      }

      return NextResponse.json({ error: "Discount not found" }, { status: 404 });
    }

    let discounts = await prisma.discount.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Auto-seed presets into DB if table is completely empty
    if (discounts.length === 0) {
      try {
        const seeded = [];
        for (const preset of CURATED_MASTER_DISCOUNTS) {
          const created = await prisma.discount.create({
            data: {
              id: preset.id,
              title: preset.title.trim().toUpperCase(),
              subtitle: preset.subtitle || "Promotional coupon",
              status: preset.status || "Active",
              method: preset.method || "Code",
              eligibility: preset.eligibility || "All customers",
              type: preset.type || "Amount off order",
              used: preset.used || 0,
              discountValue: preset.discountValue || "10%",
              minSpend: preset.minSpend ? Number(preset.minSpend) : null,
              expiryDate: preset.expiryDate || null,
              productIds: Array.isArray(preset.productIds) ? preset.productIds : [],
            },
          });
          seeded.push(created);
        }
        discounts = seeded;
      } catch (seedErr) {
        console.warn("Could not auto-seed presets to DB:", seedErr);
      }
    }

    return NextResponse.json({ success: true, discounts });
  } catch (error: any) {
    console.error("Error in GET /api/admin/discounts:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch discounts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();

    // Action: Restore Curated Presets Bulk Sync
    if (body.action === "restore" || body.action === "bulk") {
      const presetsToRestore =
        Array.isArray(body.discounts) && body.discounts.length > 0
          ? body.discounts
          : CURATED_MASTER_DISCOUNTS;

      const restoredDiscounts = [];
      for (const preset of presetsToRestore) {
        const cleanTitle = preset.title.trim().toUpperCase();
        const disc = await prisma.discount.upsert({
          where: { id: preset.id },
          update: {
            title: cleanTitle,
            subtitle: preset.subtitle || "Promotional coupon",
            status: preset.status || "Active",
            method: preset.method || "Code",
            eligibility: preset.eligibility || "All customers",
            type: preset.type || "Amount off order",
            discountValue: preset.discountValue || "10%",
            minSpend: preset.minSpend ? Number(preset.minSpend) : null,
            expiryDate: preset.expiryDate || null,
            productIds: Array.isArray(preset.productIds) ? preset.productIds : [],
          },
          create: {
            id: preset.id,
            title: cleanTitle,
            subtitle: preset.subtitle || "Promotional coupon",
            status: preset.status || "Active",
            method: preset.method || "Code",
            eligibility: preset.eligibility || "All customers",
            type: preset.type || "Amount off order",
            used: preset.used || 0,
            discountValue: preset.discountValue || "10%",
            minSpend: preset.minSpend ? Number(preset.minSpend) : null,
            expiryDate: preset.expiryDate || null,
            productIds: Array.isArray(preset.productIds) ? preset.productIds : [],
          },
        });
        restoredDiscounts.push(disc);
      }

      return NextResponse.json({
        success: true,
        message: "Presets restored and saved to backend database",
        discounts: restoredDiscounts,
      });
    }

    const {
      id,
      title,
      subtitle,
      status,
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

    const cleanTitle = (title || "").trim().toUpperCase();
    if (!cleanTitle) {
      return NextResponse.json({ error: "Discount code is required" }, { status: 400 });
    }

    // Check if code or ID already exists in DB
    const existing = await prisma.discount.findFirst({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          { title: { equals: cleanTitle, mode: "insensitive" as const } },
        ],
      },
    });

    if (existing) {
      // Update existing discount details
      const updated = await prisma.discount.update({
        where: { id: existing.id },
        data: {
          title: cleanTitle,
          subtitle: subtitle || existing.subtitle,
          status: status || existing.status,
          method: method || existing.method,
          eligibility: eligibility || existing.eligibility,
          type: type || existing.type,
          discountValue: discountValue || existing.discountValue,
          minSpend: minSpend !== undefined ? (minSpend ? Number(minSpend) : null) : existing.minSpend,
          startDate: startDate !== undefined ? (startDate || null) : (existing as any).startDate,
          expiryDate: expiryDate !== undefined ? (expiryDate || null) : existing.expiryDate,
          maxUses: maxUses !== undefined ? (maxUses ? Number(maxUses) : null) : existing.maxUses,
          productIds: Array.isArray(productIds) ? productIds : existing.productIds,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Discount code "${updated.title}" updated in database`,
        discount: updated,
      });
    }

    // Create new discount in Neon DB
    const newId = id || `disc-${Date.now()}`;
    const newDiscount = await prisma.discount.create({
      data: {
        id: newId,
        title: cleanTitle,
        subtitle: subtitle || "Promotional coupon",
        status: status || "Active",
        method: method || "Code",
        eligibility: eligibility || "All customers",
        type: type || "Amount off order",
        used: 0,
        discountValue: discountValue || "10%",
        minSpend: minSpend ? Number(minSpend) : null,
        startDate: startDate || null,
        expiryDate: expiryDate || null,
        maxUses: maxUses ? Number(maxUses) : null,
        productIds: Array.isArray(productIds) ? productIds : [],
      },
    });

    return NextResponse.json({
      success: true,
      message: `Discount code "${newDiscount.title}" saved to database`,
      discount: newDiscount,
    });
  } catch (error: any) {
    console.error("Error in POST /api/admin/discounts:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create discount" },
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

    if (!id && !title) {
      return NextResponse.json(
        { error: "Discount ID or code is required to update" },
        { status: 400 }
      );
    }

    const cleanTitle = title ? title.trim().toUpperCase() : undefined;

    // Check if discount exists by id or title
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
      // If not present in DB, create it seamlessly
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
    console.error("Error in PATCH /api/admin/discounts:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update discount" },
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
      return NextResponse.json({ error: "Discount ID is required" }, { status: 400 });
    }

    // Find and delete discount by ID or Title
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
      message: `Discount deleted successfully from database`,
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/discounts:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete discount" },
      { status: 500 }
    );
  }
}
