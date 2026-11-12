import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: email.trim().toLowerCase() },
      update: { active: true },
      create: { email: email.trim().toLowerCase(), active: true },
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed to Kurma Sacred Journal",
      subscriber,
    });
  } catch (error: any) {
    console.error("Error in /api/newsletter:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}

