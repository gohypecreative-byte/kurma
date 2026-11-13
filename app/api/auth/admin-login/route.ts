import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  createAdminToken,
  attachAdminSessionCookie,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Admin email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query Neon DB for user record
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        phone: true,
        memberSince: true,
      },
    });

    // If default admin does not exist yet in database, initialize securely
    if (!user && (cleanEmail === "admin@kurmaluxury.com" || cleanEmail === "admin@kurma.com")) {
      const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || "Admin@Kurma2026";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      user = await prisma.user.create({
        data: {
          name: "Kurma Atelier Sovereign Administrator",
          email: cleanEmail,
          password: hashedPassword,
          role: "ADMIN",
          memberSince: "January 2026",
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          phone: true,
          memberSince: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid administrator credentials" },
        { status: 401 }
      );
    }

    // Role-based authorization: only users with role "ADMIN" are permitted
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied: Account does not have administrator privileges" },
        { status: 403 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "Administrator account requires password setup" },
        { status: 401 }
      );
    }

    // Secure password verification using bcrypt.compare()
    let isMatch = false;
    if (user.password.startsWith("$2")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Legacy fallback: verify plain-text and immediately upgrade to bcrypt hash
      isMatch = user.password === password;
      if (isMatch) {
        const upgradedHash = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: upgradedHash },
        });
      }
    }

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid administrator credentials" },
        { status: 401 }
      );
    }

    // Generate signed HMAC-SHA256 JWT admin session token (7-day validity)
    const token = await createAdminToken({
      userId: user.id,
      email: user.email,
      name: "Admin",
      role: "ADMIN",
    });

    // Never return the password or hashed password in API responses
    const response = NextResponse.json({
      success: true,
      message: "Welcome back, Admin",
      user: {
        id: user.id,
        name: "Admin",
        email: user.email,
        role: "ADMIN",
        memberSince: user.memberSince,
      },
    });

    // Attach secure HTTP-only cookie
    return attachAdminSessionCookie(response, token);
  } catch (error: any) {
    console.error("Error in /api/auth/admin-login:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to authenticate administrator" },
      { status: 500 }
    );
  }
}

