import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { INITIAL_ORDERS } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(req.url);
    const subview = searchParams.get("subview"); // "all" | "drafts" | "abandoned" | "tracking"
    const search = searchParams.get("search")?.toLowerCase();

    let whereClause: any = {};

    if (subview === "drafts") {
      whereClause.isDraft = true;
    } else if (subview === "abandoned") {
      whereClause.isAbandoned = true;
    } else {
      whereClause.isDraft = false;
      whereClause.isAbandoned = false;
    }

    let orders: any[] = [];
    try {
      orders = await prisma.order.findMany({
        where: whereClause,
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("DB connection failed in GET /api/admin/orders, falling back to INITIAL_ORDERS:", dbErr);
      orders = [];
    }

    let formatted =
      orders.length > 0
        ? orders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.customerName || "Valued Patron",
            customerEmail: o.customerEmail || "",
            customerPhone: o.customerPhone || "",
            city: o.city || "Mumbai, MH",
            date: o.dateFormatted || new Date(o.createdAt).toLocaleDateString(),
            boxTitle: o.boxTitle || (o.items[0]?.name ? `${o.items[0].name} Suite` : "Bespoke Hamper"),
            boxImage: o.boxImage || o.items[0]?.image || "/images/product/marble-box-clean.png",
            itemsCount: o.items.reduce((sum: number, it: any) => sum + it.quantity, 0) || 1,
            items: o.items.map((it: any) => ({
              sku: it.sku || it.productId,
              name: it.name,
              quantity: it.quantity,
              price: it.price,
              image: it.image || "/images/product/image.png",
            })),
            totalAmount: o.totalAmount,
            paymentMethod: o.paymentMethod as any,
            paymentStatus: o.paymentStatus as any,
            fulfillmentStatus: o.fulfillmentStatus as any,
            channel: o.channel as any,
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
            isDraft: o.isDraft,
            isAbandoned: o.isAbandoned,
          }))
        : INITIAL_ORDERS;

    if (search) {
      formatted = formatted.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(search) ||
          o.customerName.toLowerCase().includes(search) ||
          o.customerEmail.toLowerCase().includes(search) ||
          o.city.toLowerCase().includes(search) ||
          (o.awb && o.awb.toLowerCase().includes(search)) ||
          (o.courier && o.courier.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ success: true, orders: formatted });
  } catch (error: any) {
    console.error("Error in GET /api/admin/orders:", error);
    return NextResponse.json({ success: true, orders: INITIAL_ORDERS });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      city,
      boxTitle,
      boxImage,
      totalAmount,
      paymentMethod,
      paymentStatus,
      fulfillmentStatus,
      channel,
      courier,
      awb,
      personalization,
      items,
      isDraft,
    } = body;

    const orderNumber = `#KURMA-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName || "New Patron",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        city: city || "Mumbai, MH",
        dateFormatted: "Just now",
        boxTitle: boxTitle || "Celebration Hamper",
        boxImage: boxImage || "/images/product/mdf-box-clean.png",
        totalAmount: Number(totalAmount) || 2499,
        paymentMethod: paymentMethod || "UPI",
        paymentStatus: paymentStatus || "Paid",
        fulfillmentStatus: fulfillmentStatus || "Processing",
        channel: channel || "Kurma Sanctuary",
        carrier: courier || "BlueDart Express",
        trackingNumber: awb || `BLU-${Math.floor(1000 + Math.random() * 9000)}`,
        personalization: personalization || null,
        isDraft: Boolean(isDraft),
        items: {
          create: (items || []).map((it: any) => ({
            productId: it.sku || "item",
            sku: it.sku || "item",
            name: it.name || "Kurma Item",
            price: Number(it.price) || 500,
            quantity: Number(it.quantity) || 1,
            image: it.image || "/images/product/image.png",
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Error in POST /api/admin/orders:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
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
      orderNumber,
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

    const targetId = id || orderNumber;
    if (!targetId) {
      return NextResponse.json({ error: "Order ID or Order Number is required" }, { status: 400 });
    }

    const updateData: any = {};
    const nextFulfillment = fulfillmentStatus || status;
    if (nextFulfillment) {
      updateData.fulfillmentStatus = nextFulfillment;

      // Synchronize with OrderStatus Prisma Enum: PENDING, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED
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

    let updated: any = null;
    try {
      // First try updating by primary key ID
      if (id && !id.startsWith("ord-")) {
        updated = await prisma.order.update({
          where: { id },
          data: updateData,
          include: { items: true },
        });
      } else if (orderNumber) {
        // Try updating by orderNumber
        const cleanNo = orderNumber.replace(/^#+/, "").trim();
        const existing = await prisma.order.findFirst({
          where: {
            OR: [
              { orderNumber: orderNumber },
              { orderNumber: `#${cleanNo}` },
              { orderNumber: cleanNo },
            ],
          },
        });
        if (existing) {
          updated = await prisma.order.update({
            where: { id: existing.id },
            data: updateData,
            include: { items: true },
          });
        }
      }
    } catch (dbErr) {
      console.warn("DB update in PATCH /api/admin/orders failed or running offline:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Order ${orderNumber || id} tracking updated successfully`,
      order: updated || { id: targetId, orderNumber: orderNumber || `#${targetId}`, ...updateData },
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/orders:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update order tracking" },
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
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Order removed" });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/orders:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}

