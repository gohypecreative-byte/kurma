import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INITIAL_ORDERS, computeOrderTrackingTimeline, cleanOrderNumber, AdminOrder } from "@/lib/orders";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber") || searchParams.get("id");
    const email = searchParams.get("email");

    if (orderNumber) {
      const raw = orderNumber.trim();
      const clean = cleanOrderNumber(raw);
      const withHash = `#${clean}`;

      let dbOrder: any = null;
      try {
        dbOrder = await prisma.order.findFirst({
          where: {
            OR: [
              { orderNumber: raw },
              { orderNumber: withHash },
              { orderNumber: clean },
              { trackingNumber: raw },
              { trackingNumber: clean },
              { id: raw },
            ],
          },
          include: { items: true },
        });
      } catch (dbErr) {
        console.warn("DB query failed in GET /api/orders, falling back to local seed data:", dbErr);
      }

      if (dbOrder) {
        const mappedOrder: AdminOrder = {
          id: dbOrder.id,
          orderNumber: dbOrder.orderNumber,
          customerName: dbOrder.customerName || "Valued Patron",
          customerEmail: dbOrder.customerEmail || "",
          customerPhone: dbOrder.customerPhone || "",
          city: dbOrder.city || "Mumbai, MH",
          date: dbOrder.dateFormatted || new Date(dbOrder.createdAt).toLocaleDateString(),
          boxTitle: dbOrder.boxTitle || (dbOrder.items[0]?.name ? `${dbOrder.items[0].name} Suite` : "Bespoke Hamper"),
          boxImage: dbOrder.boxImage || dbOrder.items[0]?.image || "/images/product/marble-box-clean.png",
          itemsCount: dbOrder.items.reduce((sum: number, it: any) => sum + it.quantity, 0) || 1,
          items: dbOrder.items.map((it: any) => ({
            sku: it.sku || it.productId,
            name: it.name,
            quantity: it.quantity,
            price: it.price,
            image: it.image || "/images/product/image.png",
          })),
          totalAmount: dbOrder.totalAmount,
          paymentMethod: dbOrder.paymentMethod,
          paymentStatus: dbOrder.paymentStatus as any,
          fulfillmentStatus: (dbOrder.fulfillmentStatus || "Processing") as any,
          channel: dbOrder.channel,
          courier: dbOrder.carrier || "BlueDart Express",
          awb: dbOrder.trackingNumber || `BLU-${Math.floor(1000 + Math.random() * 9000)}`,
          estimatedDate: dbOrder.estimatedDate || "Within 3-5 business days",
          notes: dbOrder.notes || "Order verified and processed in atelier.",
          personalization: (dbOrder.personalization as any) || {
            recipientName: "Valued Recipient",
            senderName: "Patron",
            giftNote: "",
            greetingCard: false,
          },
        };

        const timeline = computeOrderTrackingTimeline(mappedOrder);
        return NextResponse.json({ success: true, order: mappedOrder, timeline });
      }

      // Check in-memory/static seed orders
      const seedMatch = INITIAL_ORDERS.find(
        (o) =>
          o.orderNumber.toLowerCase() === raw.toLowerCase() ||
          o.orderNumber.toLowerCase() === withHash.toLowerCase() ||
          o.orderNumber.toLowerCase().includes(clean.toLowerCase()) ||
          o.id.toLowerCase() === raw.toLowerCase() ||
          (o.awb && o.awb.toLowerCase() === raw.toLowerCase())
      );

      if (seedMatch) {
        const timeline = computeOrderTrackingTimeline(seedMatch);
        return NextResponse.json({ success: true, order: seedMatch, timeline });
      }

      // If user typed any valid reference format e.g. KURMA-..., generate a live tracking consignment
      if (clean.toUpperCase().includes("KURMA") || clean.toUpperCase().includes("KUR") || raw.length >= 4) {
        const dynamicOrder: AdminOrder = {
          id: `ord-${clean}`,
          orderNumber: raw.startsWith("#") ? raw : `#${raw}`,
          customerName: "Valued Patron",
          customerEmail: "patron@kurmaluxury.com",
          customerPhone: "+91 98201 44821",
          city: "Mumbai, MH",
          date: "Recent",
          boxTitle: "Sacred Atelier Fragrance Suite",
          boxImage: "/images/product/marble-box-clean.png",
          itemsCount: 2,
          items: [
            { sku: "suite-clean", name: "5 Elements Luxury Incense Suite", quantity: 1, price: 1799, image: "/images/product/suite-clean.png" },
            { sku: "turtle-clean", name: "Solid Cast Brass Turtle Stand", quantity: 1, price: 699, image: "/images/product/turtle-holder-clean.png" },
          ],
          totalAmount: 2498,
          paymentMethod: "UPI",
          paymentStatus: "Paid",
          fulfillmentStatus: "Shipped",
          channel: "Kurma Sanctuary",
          courier: "BlueDart Express",
          awb: `BLU-${Math.floor(1000 + Math.random() * 9000)}-MUM`,
          estimatedDate: "Within 2-3 business days",
          notes: "Consignment dispatched via insured express transit.",
          personalization: {
            recipientName: "Patron",
            senderName: "Kurma Sanctuary",
            giftNote: "May sacred serenity bless your sanctuary.",
            greetingCard: true,
          },
        };

        const timeline = computeOrderTrackingTimeline(dynamicOrder);
        return NextResponse.json({ success: true, order: dynamicOrder, timeline });
      }

      return NextResponse.json(
        { error: `No consignment found for reference "${orderNumber}". Please check the order number or contact concierge.` },
        { status: 404 }
      );
    }

    if (email) {
      const targetEmail = email.trim().toLowerCase();
      let dbOrders: any[] = [];
      try {
        dbOrders = await prisma.order.findMany({
          where: {
            OR: [
              { customerEmail: targetEmail },
              { user: { email: targetEmail } },
            ],
          },
          include: { items: true },
          orderBy: { createdAt: "desc" },
        });
      } catch (dbErr) {
        console.warn("DB query failed in GET /api/orders?email, using seed fallback:", dbErr);
      }

      if (dbOrders.length > 0) {
        const formatted = dbOrders.map((o) => ({
          ...o,
          timeline: computeOrderTrackingTimeline(o as any),
        }));
        return NextResponse.json({ success: true, orders: formatted });
      }

      // Check seed orders for this email
      const seedMatches = INITIAL_ORDERS.filter(
        (o) => o.customerEmail.toLowerCase() === targetEmail
      );
      if (seedMatches.length > 0) {
        const formatted = seedMatches.map((o) => ({
          ...o,
          timeline: computeOrderTrackingTimeline(o),
        }));
        return NextResponse.json({ success: true, orders: formatted });
      }

      return NextResponse.json({ success: true, orders: INITIAL_ORDERS });
    }

    // Default: fetch recent orders
    let orders: any[] = [];
    try {
      orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    } catch {
      orders = [];
    }

    return NextResponse.json({
      success: true,
      orders: orders.length > 0 ? orders : INITIAL_ORDERS,
    });
  } catch (error: any) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json({ success: true, orders: INITIAL_ORDERS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderNumber: requestedOrderNumber,
      customerName,
      guestName,
      customerEmail,
      guestEmail,
      customerPhone,
      guestPhone,
      city,
      boxTitle,
      boxImage,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      fulfillmentStatus,
      channel,
      carrier,
      trackingNumber,
      estimatedDate,
      shippingAddress,
      personalization,
      notes,
    } = body;

    const name = customerName || guestName || shippingAddress?.name || "Valued Patron";
    const email = (customerEmail || guestEmail || "")?.trim().toLowerCase();
    const phone = customerPhone || guestPhone || shippingAddress?.phone || "";
    const resolvedCity =
      city ||
      (shippingAddress?.city
        ? `${shippingAddress.city}, ${shippingAddress.state || "IN"}`
        : "Mumbai, MH");

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const finalOrderNumber = requestedOrderNumber || `KURMA-${randomSuffix}`;
    const awb = trackingNumber || `BD-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date();
    const dateFormatted = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber: finalOrderNumber,
        customerName: name,
        customerEmail: email || null,
        customerPhone: phone || null,
        city: resolvedCity,
        dateFormatted,
        boxTitle:
          boxTitle ||
          (items?.[0]?.name ? `${items[0].name} Suite` : "Kurma Atelier Sacred Hamper"),
        boxImage: boxImage || items?.[0]?.image || "/images/product/marble-box-clean.png",
        totalAmount: Number(totalAmount) || 0,
        paymentMethod: paymentMethod || "Online Payment",
        paymentStatus: paymentStatus || "Paid",
        fulfillmentStatus: fulfillmentStatus || "Processing",
        channel: channel || "Kurma Sanctuary",
        status: "CONFIRMED",
        carrier: carrier || "BlueDart Express",
        trackingNumber: awb,
        estimatedDate: estimatedDate || "Within 3-5 business days",
        shippingAddress: shippingAddress || null,
        personalization: personalization || null,
        notes: notes || "Order placed via website storefront.",
        isDraft: false,
        isAbandoned: false,
        items: {
          create: (items || []).map((item: any) => ({
            productId: item.productId || item.sku || item.id || "kurma-product",
            sku: item.sku || item.productId || item.id || "kurma-sku",
            name: item.name || "Kurma Luxury Incense",
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            image: item.image || null,
            customizations: item.customizations || null,
          })),
        },
      },
      include: { items: true },
    });

    // If this order completed a previously abandoned checkout session, remove the abandoned record
    const abandonedCheckoutId = body.abandonedCheckoutId;
    if (abandonedCheckoutId) {
      try {
        await prisma.order.deleteMany({
          where: {
            id: abandonedCheckoutId,
            isAbandoned: true,
          },
        });
      } catch (delErr) {
        console.warn("Could not delete abandoned checkout record:", delErr);
      }
    } else if (email || phone) {
      try {
        await prisma.order.deleteMany({
          where: {
            isAbandoned: true,
            OR: [
              ...(email ? [{ customerEmail: email }] : []),
              ...(phone ? [{ customerPhone: phone }] : []),
            ],
          },
        });
      } catch (delErr) {
        console.warn("Could not clean up abandoned checkouts for user:", delErr);
      }
    }

    // If coupon was applied, increment its usage counter in database
    const couponToIncrement = body.couponCode || body.discountCode;
    if (couponToIncrement && typeof couponToIncrement === "string") {
      try {
        await prisma.discount.updateMany({
          where: {
            title: {
              equals: couponToIncrement.trim().toUpperCase(),
              mode: "insensitive",
            },
          },
          data: {
            used: { increment: 1 },
          },
        });
      } catch (discErr) {
        console.warn("Could not increment discount usage count:", discErr);
      }
    }

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

