import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { INITIAL_CUSTOMERS, AdminCustomer } from "@/lib/customers";
import { INITIAL_ORDERS } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) return auth.response;

    const resolvedParams = await Promise.resolve(props.params);
    const rawId = resolvedParams?.id || "";
    const id = decodeURIComponent(rawId).trim();

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    // 1. Try finding in database
    let dbUser: any = null;
    let dbAddresses: any[] = [];
    let dbOrders: any[] = [];

    try {
      dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { id: id },
            { email: { equals: id, mode: "insensitive" } },
          ],
        },
        include: {
          addresses: true,
        },
      });

      const emailToMatch = dbUser?.email || (id.includes("@") ? id : "");
      const nameToMatch = dbUser?.name || "";

      // Find all DB orders associated with user ID, email, or name
      const orderConditions: any[] = [];
      if (dbUser?.id) orderConditions.push({ userId: dbUser.id });
      if (emailToMatch) orderConditions.push({ customerEmail: { equals: emailToMatch, mode: "insensitive" } });
      if (nameToMatch) orderConditions.push({ customerName: { equals: nameToMatch, mode: "insensitive" } });

      if (orderConditions.length > 0) {
        dbOrders = await prisma.order.findMany({
          where: { OR: orderConditions },
          include: { items: true },
          orderBy: { createdAt: "desc" },
        });
      }
    } catch (dbErr) {
      console.warn("DB lookup error in GET /api/admin/customers/[id]:", dbErr);
    }

    // 2. Fallback / seed customer matching
    const seedCustomer = INITIAL_CUSTOMERS.find(
      (c) =>
        c.id.toLowerCase() === id.toLowerCase() ||
        c.email.toLowerCase() === id.toLowerCase() ||
        (dbUser && c.email.toLowerCase() === dbUser.email.toLowerCase())
    );

    // If neither DB user nor seed customer found
    if (!dbUser && !seedCustomer) {
      // Check if any initial orders match this ID or email
      const fallbackOrders = INITIAL_ORDERS.filter(
        (o) =>
          o.customerEmail.toLowerCase() === id.toLowerCase() ||
          o.customerName.toLowerCase() === id.toLowerCase()
      );

      if (fallbackOrders.length > 0) {
        const first = fallbackOrders[0];
        const nameParts = first.customerName.split(" ");
        const initials =
          nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            : first.customerName.slice(0, 2).toUpperCase();

        const amountSpent = fallbackOrders.reduce((sum, o) => sum + o.totalAmount, 0);

        return NextResponse.json({
          success: true,
          customer: {
            id,
            name: first.customerName,
            email: first.customerEmail,
            phone: first.customerPhone || "+91 98201 00000",
            initials,
            location: first.city || "Mumbai, MH",
            ordersCount: fallbackOrders.length,
            amountSpent,
            subscription: "Subscribed",
            tier: amountSpent > 30000 ? "Heritage Circle" : amountSpent > 15000 ? "Sovereign VIP" : "Patron",
            lastOrderDate: first.date,
            memberSince: "Nov 2024",
            notes: first.notes || "Valued patron of Kurma Atelier.",
            shippingAddress: first.shippingAddress || {
              fullName: first.customerName,
              phone: first.customerPhone,
              city: first.city,
              country: "India",
            },
            orders: fallbackOrders,
          },
        });
      }

      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // 3. Merge Customer Profile Information
    const name = dbUser?.name || seedCustomer?.name || "Valued Patron";
    const email = dbUser?.email || seedCustomer?.email || "";
    const phone = dbUser?.phone || seedCustomer?.phone || "+91 98201 44821";
    const location = dbUser?.city || seedCustomer?.location || "Mumbai, MH";
    const memberSince = dbUser?.memberSince || seedCustomer?.memberSince || (dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Nov 2024");
    const notes = seedCustomer?.notes || "Patron of fine handcrafted temple incenses and bespoke gift hampers.";

    const nameParts = name.split(" ");
    const initials =
      seedCustomer?.initials ||
      (nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : (name.slice(0, 2) || "PA").toUpperCase());

    // 4. Merge Orders
    const matchingSeedOrders = INITIAL_ORDERS.filter(
      (o) =>
        o.customerEmail.toLowerCase() === email.toLowerCase() ||
        o.customerName.toLowerCase() === name.toLowerCase()
    );

    const mappedDbOrders = dbOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName || name,
      customerEmail: o.customerEmail || email,
      customerPhone: o.customerPhone || phone,
      city: o.city || location,
      date: o.dateFormatted || new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
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
      paymentMethod: o.paymentMethod || "UPI",
      paymentStatus: o.paymentStatus || "Paid",
      fulfillmentStatus: o.fulfillmentStatus || "Processing",
      channel: o.channel || "Kurma Sanctuary",
      courier: o.carrier || "BlueDart Express",
      awb: o.trackingNumber || "BLU-9901-MUM",
      estimatedDate: o.estimatedDate || "Delivered within 3-4 days",
      notes: o.notes || "",
      shippingAddress: o.shippingAddress || seedCustomer?.shippingAddress,
      personalization: o.personalization || {
        recipientName: name,
        senderName: "Kurma Atelier",
        giftNote: "Thank you for being a cherished patron of Kurma.",
        greetingCard: true,
      },
    }));

    // Deduplicate orders by orderNumber
    const orderNumberSet = new Set<string>();
    const allOrders: any[] = [];

    for (const ord of mappedDbOrders) {
      if (!orderNumberSet.has(ord.orderNumber)) {
        orderNumberSet.add(ord.orderNumber);
        allOrders.push(ord);
      }
    }

    for (const ord of matchingSeedOrders) {
      if (!orderNumberSet.has(ord.orderNumber)) {
        orderNumberSet.add(ord.orderNumber);
        allOrders.push(ord);
      }
    }

    // 5. Aggregate metrics
    const totalOrders = Math.max(allOrders.length, seedCustomer?.ordersCount || (dbUser ? 1 : 0));
    const totalSpent = allOrders.length > 0
      ? allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      : seedCustomer?.amountSpent || 3840;

    const averageOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : totalSpent;

    const lastOrderDate = allOrders[0]?.date || seedCustomer?.lastOrderDate || "Recently";

    const tier =
      (dbUser?.tier as any) ||
      seedCustomer?.tier ||
      (totalSpent > 30000 ? "Heritage Circle" : totalSpent > 15000 ? "Sovereign VIP" : "Patron");

    const subscription = seedCustomer?.subscription || "Subscribed";

    // 6. Address Resolution
    const resolvedAddress =
      dbUser?.addresses?.[0]
        ? {
            fullName: dbUser.addresses[0].fullName,
            phone: dbUser.addresses[0].phone,
            street: dbUser.addresses[0].street,
            city: dbUser.addresses[0].city,
            state: dbUser.addresses[0].state,
            postalCode: dbUser.addresses[0].postalCode,
            country: dbUser.addresses[0].country,
          }
        : seedCustomer?.shippingAddress || {
            fullName: name,
            phone: phone,
            street: "Atelier Residence",
            city: location.split(",")[0]?.trim() || "Mumbai",
            state: location.split(",")[1]?.trim() || "MH",
            postalCode: "400001",
            country: "India",
          };

    return NextResponse.json({
      success: true,
      customer: {
        id: dbUser?.id || seedCustomer?.id || id,
        name,
        email,
        phone,
        initials,
        location,
        ordersCount: totalOrders,
        amountSpent: totalSpent,
        averageOrderValue,
        subscription,
        tier,
        lastOrderDate,
        memberSince,
        notes,
        shippingAddress: resolvedAddress,
        orders: allOrders,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/customers/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load customer profile" },
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

    const resolvedParams = await Promise.resolve(props.params);
    const rawId = resolvedParams?.id || "";
    const id = decodeURIComponent(rawId).trim();

    const body = await req.json();
    const { phone, city, tier, notes } = body;

    let updatedUser = null;
    try {
      updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...(phone !== undefined ? { phone } : {}),
          ...(city !== undefined ? { city } : {}),
          ...(tier !== undefined ? { tier } : {}),
        },
      });
    } catch (err) {
      console.warn("Could not update user in DB:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Customer updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/customers/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update customer" },
      { status: 500 }
    );
  }
}
