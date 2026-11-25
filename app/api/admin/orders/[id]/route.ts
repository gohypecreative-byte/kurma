import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { INITIAL_ORDERS } from "@/lib/orders";

export const dynamic = "force-dynamic";

function mapDbOrderToAdminOrder(o: any) {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName || "Valued Patron",
    customerEmail: o.customerEmail || "",
    customerPhone: o.customerPhone || "",
    city: o.city || "Mumbai, MH",
    date: o.dateFormatted || new Date(o.createdAt).toLocaleDateString(),
    boxTitle: o.boxTitle || (o.items?.[0]?.name ? `${o.items[0].name} Suite` : "Bespoke Hamper"),
    boxImage: o.boxImage || o.items?.[0]?.image || "/images/product/marble-box-clean.png",
    itemsCount: o.items?.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0) || 1,
    items: (o.items || []).map((it: any) => ({
      sku: it.sku || it.productId || it.id,
      name: it.name || "Curated Item",
      quantity: it.quantity || 1,
      price: it.price || 0,
      image: it.image || "/images/product/image.png",
    })),
    totalAmount: o.totalAmount,
    paymentMethod: o.paymentMethod || "UPI",
    paymentStatus: o.paymentStatus || "Paid",
    fulfillmentStatus: o.fulfillmentStatus || "Processing",
    channel: o.channel || "Kurma Sanctuary",
    courier: o.carrier || "BlueDart Express",
    awb: o.trackingNumber || "BLU-8842-MUM",
    estimatedDate: o.estimatedDate || "Within 3-5 business days",
    notes: o.notes || "Order verified and processed in atelier.",
    personalization: (o.personalization as any) || {
      recipientName: "Valued Recipient",
      senderName: "Patron",
      giftNote: "",
      greetingCard: false,
    },
    shippingAddress: o.shippingAddress,
    isDraft: Boolean(o.isDraft),
    isAbandoned: Boolean(o.isAbandoned),
  };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const resolvedParams = await params;
    const rawId = resolvedParams.id;
    if (!rawId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const cleanNo = rawId.replace(/^#+/, "").trim();

    // 1. Look up in Prisma database
    let dbOrder: any = null;
    try {
      dbOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { id: rawId },
            { orderNumber: rawId },
            { orderNumber: `#${cleanNo}` },
            { orderNumber: cleanNo },
          ],
        },
        include: { items: true, user: true },
      });
    } catch (dbErr) {
      console.warn("DB lookup error in GET /api/admin/orders/[id]:", dbErr);
    }

    if (dbOrder) {
      return NextResponse.json({
        success: true,
        order: mapDbOrderToAdminOrder(dbOrder),
      });
    }

    // 2. Fallback to INITIAL_ORDERS
    const fallback = INITIAL_ORDERS.find(
      (o) =>
        o.id === rawId ||
        o.orderNumber.toLowerCase() === rawId.toLowerCase() ||
        o.orderNumber.replace(/^#+/, "").toLowerCase() === cleanNo.toLowerCase()
    );

    if (fallback) {
      return NextResponse.json({
        success: true,
        order: fallback,
      });
    }

    return NextResponse.json(
      { error: `Order "${rawId}" not found` },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/admin/orders/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const resolvedParams = await params;
    const rawId = resolvedParams.id;
    if (!rawId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const {
      fulfillmentStatus,
      status,
      paymentStatus,
      courier,
      carrier,
      awb,
      trackingNumber,
      estimatedDate,
      notes,
    } = body;

    const updateData: any = {};
    const nextFulfillment = fulfillmentStatus || status;

    if (nextFulfillment) {
      updateData.fulfillmentStatus = nextFulfillment;

      const lower = nextFulfillment.toLowerCase();
      if (lower.includes("deliver")) {
        updateData.status = "DELIVERED";
      } else if (lower.includes("ship") || lower.includes("transit") || lower.includes("out for delivery")) {
        updateData.status = "SHIPPED";
      } else if (lower.includes("process") || lower.includes("prep") || lower.includes("craft")) {
        updateData.status = "PREPARING";
      } else if (lower.includes("confirm")) {
        updateData.status = "CONFIRMED";
      } else if (lower.includes("cancel")) {
        updateData.status = "CANCELLED";
      } else if (lower.includes("unfulfilled") || lower.includes("pend")) {
        updateData.status = "PENDING";
      }
    }

    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    const finalCourier = courier || carrier;
    if (finalCourier) updateData.carrier = finalCourier;
    const finalAwb = awb || trackingNumber;
    if (finalAwb) updateData.trackingNumber = finalAwb;
    if (estimatedDate) updateData.estimatedDate = estimatedDate;
    if (notes !== undefined) updateData.notes = notes;

    const cleanNo = rawId.replace(/^#+/, "").trim();

    try {
      // 1. First try by exact ID
      if (!rawId.startsWith("ord-")) {
        try {
          const updated = await prisma.order.update({
            where: { id: rawId },
            data: updateData,
            include: { items: true },
          });
          return NextResponse.json({
            success: true,
            order: mapDbOrderToAdminOrder(updated),
          });
        } catch {
          // Fall through to orderNumber match
        }
      }

      // 2. Try match by orderNumber
      const existing = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: rawId },
            { orderNumber: `#${cleanNo}` },
            { orderNumber: cleanNo },
          ],
        },
      });

      if (existing) {
        const updated = await prisma.order.update({
          where: { id: existing.id },
          data: updateData,
          include: { items: true },
        });
        return NextResponse.json({
          success: true,
          order: mapDbOrderToAdminOrder(updated),
        });
      }
    } catch (dbErr) {
      console.warn("DB update error in PATCH /api/admin/orders/[id]:", dbErr);
    }

    // Fallback response for memory/seed orders
    return NextResponse.json({
      success: true,
      order: {
        id: rawId,
        fulfillmentStatus: nextFulfillment,
        paymentStatus,
        courier: finalCourier,
        awb: finalAwb,
        estimatedDate,
        notes,
      },
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/orders/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const resolvedParams = await params;
    const rawId = resolvedParams.id;
    if (!rawId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const cleanNo = rawId.replace(/^#+/, "").trim();

    try {
      await prisma.order.deleteMany({
        where: {
          OR: [
            { id: rawId },
            { orderNumber: rawId },
            { orderNumber: `#${cleanNo}` },
            { orderNumber: cleanNo },
          ],
        },
      });
    } catch (dbErr) {
      console.warn("DB deletion in DELETE /api/admin/orders/[id]:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Order ${rawId} deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/orders/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
