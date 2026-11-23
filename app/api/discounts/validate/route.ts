import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, items, subtotal, customerEmail } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter a valid coupon or voucher code." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Query discount from database
    const discount = await prisma.discount.findFirst({
      where: {
        title: {
          equals: cleanCode,
          mode: "insensitive",
        },
      },
    });

    if (!discount) {
      return NextResponse.json(
        { success: false, error: `Invalid voucher code "${cleanCode}".` },
        { status: 400 }
      );
    }

    if (discount.status !== "Active") {
      return NextResponse.json(
        { success: false, error: `Coupon "${discount.title}" is no longer active.` },
        { status: 400 }
      );
    }

    // Expiry check if valid date provided and not "Ongoing"
    if (discount.expiryDate && discount.expiryDate !== "Ongoing") {
      const parsedExpiry = new Date(discount.expiryDate);
      if (!isNaN(parsedExpiry.getTime()) && parsedExpiry < new Date()) {
        return NextResponse.json(
          { success: false, error: `Coupon "${discount.title}" has expired.` },
          { status: 400 }
        );
      }
    }

    // Max uses check
    if (discount.maxUses && discount.used >= discount.maxUses) {
      return NextResponse.json(
        { success: false, error: `Coupon "${discount.title}" has reached its maximum usage limit.` },
        { status: 400 }
      );
    }

    const currentSubtotal = Number(subtotal) || 0;

    // Minimum spend check
    if (discount.minSpend && currentSubtotal < discount.minSpend) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order value of ₹${discount.minSpend.toLocaleString(
            "en-IN"
          )} required for voucher "${discount.title}". (Current order: ₹${currentSubtotal.toLocaleString(
            "en-IN"
          )})`,
        },
        { status: 400 }
      );
    }

    // Product-specific eligibility check
    const rawItems: any[] = Array.isArray(items) ? items : [];
    let eligibleSubtotal = currentSubtotal;
    let isSpecificProduct = false;
    let eligibleItemNames: string[] = [];

    if (discount.productIds && discount.productIds.length > 0) {
      isSpecificProduct = true;
      const targetSet = new Set(discount.productIds.map((id) => id.toLowerCase()));

      const matchingItems = rawItems.filter(
        (it) =>
          targetSet.has((it.skuId || "").toLowerCase()) ||
          targetSet.has((it.productId || "").toLowerCase()) ||
          targetSet.has((it.id || "").toLowerCase())
      );

      if (matchingItems.length === 0) {
        // Fetch target product names to show friendly message
        let productNames: string[] = [];
        try {
          const prods = await prisma.product.findMany({
            where: { id: { in: discount.productIds } },
            select: { name: true },
          });
          productNames = prods.map((p) => p.name);
        } catch {}

        if (productNames.length === 0) {
          productNames = discount.productIds.map(
            (id) => PRODUCTS.find((p) => p.id.toLowerCase() === id.toLowerCase())?.name || id
          );
        }

        const targetDesc =
          productNames.length > 0
            ? productNames.join(", ")
            : discount.productIds.join(", ");

        return NextResponse.json(
          {
            success: false,
            error: `Voucher "${discount.title}" is only valid on: ${targetDesc}. Please add the eligible product to your cart.`,
          },
          { status: 400 }
        );
      }

      eligibleSubtotal = matchingItems.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
        0
      );
      eligibleItemNames = matchingItems.map((it) => it.name);
    }

    // Calculate discount amount
    let discountAmount = 0;
    const valStr = discount.discountValue || "";

    if (discount.type === "Free shipping") {
      // For Free shipping vouchers, grant express shipping discount (₹250 standard or parsed amount)
      const parsedVal = parseFloat(valStr.replace(/[^0-9.]/g, ""));
      discountAmount = !isNaN(parsedVal) && parsedVal > 0 ? parsedVal : 250;
      discountAmount = Math.min(eligibleSubtotal, discountAmount);

      return NextResponse.json({
        success: true,
        code: discount.title,
        discountAmount,
        freeShipping: true,
        type: discount.type,
        discountValue: discount.discountValue || "₹250",
        eligibleProductIds: discount.productIds || [],
        message: `Voucher "${discount.title}" applied! ₹${discountAmount.toLocaleString("en-IN")} express delivery discount saved.`,
      });
    }

    if (valStr.includes("%")) {
      const pct = parseFloat(valStr.replace(/[^0-9.]/g, "")) || 0;
      discountAmount = Math.round((eligibleSubtotal * pct) / 100);
    } else {
      const fixed = parseFloat(valStr.replace(/[^0-9.]/g, "")) || 0;
      if (fixed > 0) {
        discountAmount = Math.min(eligibleSubtotal, fixed);
      } else {
        // Fallback default 10% privilege discount if no numeric amount could be parsed
        discountAmount = Math.round(eligibleSubtotal * 0.1);
      }
    }

    // Ensure valid applied voucher reduces price by at least minimum concession
    if (discountAmount <= 0 && eligibleSubtotal > 0) {
      discountAmount = Math.min(eligibleSubtotal, 250);
    }

    return NextResponse.json({
      success: true,
      code: discount.title,
      discountAmount,
      freeShipping: false,
      type: discount.type,
      discountValue: discount.discountValue,
      eligibleProductIds: discount.productIds || [],
      message: isSpecificProduct
        ? `Voucher "${discount.title}" applied to ${eligibleItemNames.join(", ")}! ₹${discountAmount.toLocaleString("en-IN")} saved.`
        : `Voucher "${discount.title}" applied! ₹${discountAmount.toLocaleString("en-IN")} saved.`,
    });
  } catch (error: any) {
    console.error("Error in POST /api/discounts/validate:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to validate discount." },
      { status: 500 }
    );
  }
}
