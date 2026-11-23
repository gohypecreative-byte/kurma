import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatAbandonedDate(d: Date): string {
  try {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const day = d.getDate().toString().padStart(2, "0");
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = hours.toString().padStart(2, "0");
    return `${month} ${day} at ${hoursStr}:${minutes} ${ampm}`;
  } catch {
    return new Date().toLocaleDateString();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      checkoutId,
      customerName,
      customerEmail,
      customerPhone,
      city,
      shippingAddress,
      items,
      totalAmount,
      notes,
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required to track checkout" },
        { status: 400 }
      );
    }

    const name = customerName?.trim() || shippingAddress?.fullName?.trim() || "Interested Patron";
    const email = (customerEmail || shippingAddress?.email || "")?.trim().toLowerCase();
    const phone = customerPhone?.trim() || shippingAddress?.phone?.trim() || "";
    const resolvedCity =
      city?.trim() ||
      (shippingAddress?.city
        ? `${shippingAddress.city}, ${shippingAddress.state || "IN"}`
        : "Online Storefront");

    const dateFormatted = formatAbandonedDate(new Date());
    const finalTotal = Number(totalAmount) || items.reduce((sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);

    // 1. If an existing checkoutId was provided, update it
    if (checkoutId) {
      try {
        const existing = await prisma.order.findUnique({
          where: { id: checkoutId },
          include: { items: true },
        });

        if (existing && existing.isAbandoned) {
          // Delete old items and recreate with fresh cart contents
          await prisma.orderItem.deleteMany({
            where: { orderId: existing.id },
          });

          const updated = await prisma.order.update({
            where: { id: existing.id },
            data: {
              customerName: name,
              customerEmail: email || existing.customerEmail,
              customerPhone: phone || existing.customerPhone,
              city: resolvedCity,
              dateFormatted,
              totalAmount: finalTotal,
              shippingAddress: shippingAddress || existing.shippingAddress,
              notes: notes || "Customer left checkout without completing payment.",
              items: {
                create: items.map((item: any) => ({
                  productId: item.productId || item.sku || item.id || "kurma-product",
                  sku: item.sku || item.productId || item.id || "kurma-sku",
                  name: item.name || "Kurma Sacred Creation",
                  price: Number(item.price) || 0,
                  quantity: Number(item.quantity) || 1,
                  image: item.image || "/images/product/image.png",
                  customizations: item.customizations || null,
                })),
              },
            },
            include: { items: true },
          });

          return NextResponse.json({
            success: true,
            checkoutId: updated.id,
            orderNumber: updated.orderNumber,
            updated: true,
          });
        }
      } catch (updateErr) {
        console.warn("Could not update existing checkout, will check or create new:", updateErr);
      }
    }

    // 2. If email or phone provided, check if a recent abandoned checkout (within last 24h) already exists
    if (email || phone) {
      try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const existingRecent = await prisma.order.findFirst({
          where: {
            isAbandoned: true,
            createdAt: { gte: oneDayAgo },
            OR: [
              ...(email ? [{ customerEmail: email }] : []),
              ...(phone ? [{ customerPhone: phone }] : []),
            ],
          },
        });

        if (existingRecent) {
          await prisma.orderItem.deleteMany({
            where: { orderId: existingRecent.id },
          });

          const updated = await prisma.order.update({
            where: { id: existingRecent.id },
            data: {
              customerName: name,
              customerEmail: email || existingRecent.customerEmail,
              customerPhone: phone || existingRecent.customerPhone,
              city: resolvedCity,
              dateFormatted,
              totalAmount: finalTotal,
              shippingAddress: shippingAddress || existingRecent.shippingAddress,
              items: {
                create: items.map((item: any) => ({
                  productId: item.productId || item.sku || item.id || "kurma-product",
                  sku: item.sku || item.productId || item.id || "kurma-sku",
                  name: item.name || "Kurma Sacred Creation",
                  price: Number(item.price) || 0,
                  quantity: Number(item.quantity) || 1,
                  image: item.image || "/images/product/image.png",
                  customizations: item.customizations || null,
                })),
              },
            },
            include: { items: true },
          });

          return NextResponse.json({
            success: true,
            checkoutId: updated.id,
            orderNumber: updated.orderNumber,
            updated: true,
          });
        }
      } catch (findErr) {
        console.warn("Recent abandoned checkout lookup failed, creating fresh record:", findErr);
      }
    }

    // 3. Create a fresh Abandoned Checkout record in the database
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `#CHECKOUT-${randomSuffix}`;

    const newAbandonedOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: name,
        customerEmail: email || null,
        customerPhone: phone || null,
        city: resolvedCity,
        dateFormatted,
        boxTitle: items[0]?.name ? `${items[0].name} Suite` : "Kurma Sacred Collection",
        boxImage: items[0]?.image || "/images/product/marble-box-clean.png",
        totalAmount: finalTotal,
        paymentMethod: "Pending Online",
        paymentStatus: "Payment pending",
        fulfillmentStatus: "Unfulfilled",
        channel: "Online Storefront",
        status: "PENDING",
        carrier: "BlueDart Express",
        trackingNumber: `ABANDONED-${randomSuffix}`,
        shippingAddress: shippingAddress || null,
        notes: notes || "Customer added products to cart and initiated checkout but left before placing order.",
        isDraft: false,
        isAbandoned: true,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || item.sku || item.id || "kurma-product",
            sku: item.sku || item.productId || item.id || "kurma-sku",
            name: item.name || "Kurma Sacred Creation",
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            image: item.image || "/images/product/image.png",
            customizations: item.customizations || null,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      checkoutId: newAbandonedOrder.id,
      orderNumber: newAbandonedOrder.orderNumber,
      order: newAbandonedOrder,
    });
  } catch (error: any) {
    console.error("Error in POST /api/checkout/abandoned:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to record abandoned checkout" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const orderNumber = searchParams.get("orderNumber");

    if (!id && !orderNumber) {
      return NextResponse.json({ error: "id or orderNumber required" }, { status: 400 });
    }

    await prisma.order.deleteMany({
      where: {
        isAbandoned: true,
        OR: [
          ...(id ? [{ id }] : []),
          ...(orderNumber ? [{ orderNumber }] : []),
        ],
      },
    });

    return NextResponse.json({ success: true, message: "Abandoned checkout removed" });
  } catch (err: any) {
    console.error("Error in DELETE /api/checkout/abandoned:", err);
    return NextResponse.json({ error: err?.message || "Delete failed" }, { status: 500 });
  }
}
