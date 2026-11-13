import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, city, tier } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password securely using bcryptjs (salt rounds: 10) before saving
    let hashedPassword: string | null = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create user record in database with only the hashed password
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone?.trim() || null,
        password: hashedPassword,
        city: city?.trim() || null,
        tier: tier || "Patron",
        role: "PATRON",
        memberSince: new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      },
      // Never return the password or hashed password in API response
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        memberSince: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Patron account created successfully in Neon DB",
      user,
    });
  } catch (error: any) {
    console.error("Error in /api/auth/register:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create account" },
      { status: 500 }
    );
  }
}

