import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query Neon DB for user
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        memberSince: true,
      },
    });

    // If user not found, create guest/patron profile automatically
    if (!user) {
      const displayName = cleanEmail.split("@")[0] || "Valued Patron";
      const formattedName =
        displayName.charAt(0).toUpperCase() + displayName.slice(1);

      user = await prisma.user.create({
        data: {
          name: formattedName,
          email: cleanEmail,
          role: "PATRON",
          memberSince: new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          memberSince: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user,
    });
  } catch (error: any) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to authenticate" },
      { status: 500 }
    );
  }
}

