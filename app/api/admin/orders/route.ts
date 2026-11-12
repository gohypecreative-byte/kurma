import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subview = searchParams.get("subview"); // "all" | "drafts" | "abandoned"
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

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    let formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName || "Valued Patron",
      customerEmail: o.customerEmail || "",
      customerPhone: o.customerPhone || "",
      city: o.city || "Mumbai, MH",
      date: o.dateFormatted || new Date(o.createdAt).toLocaleDateString(),
      boxTitle: o.boxTitle || (o.items[0]?.name ? `${o.items[0].name} Suite` : "Bespoke Hamper"),
      boxImage: o.boxImage || o.items[0]?.image || "/images/product/marble-box-clean.png",
      itemsCount: o.items.reduce((sum, it) => sum + it.quantity, 0) || 1,
      items: o.items.map((it) => ({
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
      personalization: (o.personalization as any) || {
        recipientName: "Valued Recipient",
        senderName: "Patron",
        giftNote: "",
        greetingCard: false,
      },
      isDraft: o.isDraft,
      isAbandoned: o.isAbandoned,
    }));

    if (search) {
      formatted = formatted.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(search) ||
          o.customerName.toLowerCase().includes(search) ||
          o.customerEmail.toLowerCase().includes(search) ||
          o.city.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, orders: formatted });
  } catch (error: any) {
    console.error("Error in GET /api/admin/orders:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch admin orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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
    const body = await req.json();
    const { id, fulfillmentStatus, paymentStatus, courier, awb } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (fulfillmentStatus) updateData.fulfillmentStatus = fulfillmentStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (courier) updateData.carrier = courier;
    if (awb) updateData.trackingNumber = awb;

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: `Order ${updated.orderNumber} updated successfully`,
      order: updated,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/orders:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
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

