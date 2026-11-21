import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, message, type } = body;

    if (!name || !email || !message || !phone) {
      return NextResponse.json(
        { error: "Name, email, phone number, and message are required" },
        { status: 400 }
      );
    }

    const cleanedPhone = phone.trim().replace(/[\s\-\(\)]/g, "");
    if (!/^\+?[0-9]{10,15}$/.test(cleanedPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number (at least 10 digits)" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        message: message.trim(),
        type: type === "CORPORATE" ? "CORPORATE" : "BESPOKE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Concierge inquiry recorded in database",
      inquiryId: inquiry.id,
    });
  } catch (error: any) {
    console.error("Error in /api/contact:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

