import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");
    const email = searchParams.get("email");

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      });

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, order });
    }

    if (email) {
      const orders = await prisma.order.findMany({
        where: {
          OR: [
            { customerEmail: email.trim().toLowerCase() },
            { user: { email: email.trim().toLowerCase() } },
          ],
        },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ success: true, orders });
    }

    // Default: fetch recent orders (for admin)
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      guestName,
      guestEmail,
      guestPhone,
      items,
      totalAmount,
      shippingAddress,
      notes,
    } = body;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const generatedOrderNumber = `KURMA-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber: generatedOrderNumber,
        customerName: guestName || null,
        customerEmail: guestEmail?.trim().toLowerCase() || null,
        customerPhone: guestPhone || null,
        totalAmount: Number(totalAmount) || 0,
        status: "CONFIRMED",
        carrier: "BlueDart Express",
        trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
        estimatedDate: "Within 3-5 business days",
        shippingAddress: shippingAddress || null,
        notes: notes || null,
        items: {
          create: (items || []).map((item: any) => ({
            productId: item.productId || item.sku || item.id || "kurma-bespoke",
            name: item.name || "Kurma Item",
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            image: item.image || null,
            customizations: item.customizations || null,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: "Order placed and saved to Neon DB",
      order,
    });
  } catch (error: any) {
    console.error("Error in POST /api/orders:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

