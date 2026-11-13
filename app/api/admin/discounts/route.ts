import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const discounts = await prisma.discount.findMany({
      orderBy: { createdAt: "desc" },
    });

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
    const { title, subtitle, method, eligibility, type, discountValue, minSpend, expiryDate, maxUses } = body;

    const id = `disc-${Date.now()}`;

    const newDiscount = await prisma.discount.create({
      data: {
        id,
        title: title.trim().toUpperCase(),
        subtitle: subtitle || "Promotional coupon",
        status: "Active",
        method: method || "Code",
        eligibility: eligibility || "All customers",
        type: type || "Amount off order",
        used: 0,
        discountValue: discountValue || "10%",
        minSpend: minSpend ? Number(minSpend) : null,
        expiryDate: expiryDate || null,
        maxUses: maxUses ? Number(maxUses) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Discount code "${newDiscount.title}" created`,
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
    const { id, status, used } = body;

    if (!id) {
      return NextResponse.json({ error: "Discount ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (used !== undefined) updateData.used = Number(used);

    const updated = await prisma.discount.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, discount: updated });
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

    await prisma.discount.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Discount deleted" });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/discounts:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete discount" },
      { status: 500 }
    );
  }
}

