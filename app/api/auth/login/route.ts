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

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query Neon DB for user including their stored password for verification
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        phone: true,
        role: true,
        memberSince: true,
      },
    });

    // If user exists and has a password set, verify it using bcrypt.compare()
    if (existingUser) {
      if (existingUser.password) {
        if (!password) {
          return NextResponse.json(
            { error: "Password is required" },
            { status: 400 }
          );
        }

        let isMatch = false;
        // Verify using bcrypt.compare against stored hashed password
        if (existingUser.password.startsWith("$2")) {
          isMatch = await bcrypt.compare(password, existingUser.password);
        } else {
          // Backward compatibility for legacy plain-text passwords: verify and upgrade to bcrypt hash
          isMatch = existingUser.password === password;
          if (isMatch) {
            const upgradedHash = await bcrypt.hash(password, 10);
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { password: upgradedHash },
            });
          }
        }

        if (!isMatch) {
          return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
          );
        }
      }

      // Check if user is an ADMIN
      const isAdmin =
        existingUser.role === "ADMIN" ||
        cleanEmail === "admin@kurmaluxury.com" ||
        cleanEmail === "admin@kurma.com";

      const displayName = isAdmin ? "Admin" : existingUser.name;
      const userRole = isAdmin ? "ADMIN" : existingUser.role;

      // If user is admin in system, upgrade role in database if not set
      if (isAdmin && existingUser.role !== "ADMIN") {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: "ADMIN" },
        });
      }

      // Never return the password or hashed password in API responses
      const { password: _, ...userWithoutPassword } = existingUser;

      const userResponse = {
        ...userWithoutPassword,
        name: displayName,
        role: userRole,
      };

      const response = NextResponse.json({
        success: true,
        message: `Welcome back, ${displayName}`,
        user: userResponse,
      });

      // If user is an ADMIN, automatically issue the signed admin session cookie
      if (isAdmin) {
        const adminToken = await createAdminToken({
          userId: existingUser.id,
          email: existingUser.email,
          name: "Admin",
          role: "ADMIN",
        });
        attachAdminSessionCookie(response, adminToken);
      }

      return response;
    }

    // If user not found, create guest/patron profile automatically
    const displayName = cleanEmail.split("@")[0] || "Valued Patron";
    const formattedName =
      displayName.charAt(0).toUpperCase() + displayName.slice(1);

    // Securely hash password using bcrypt.hash(password, 10) before creating user record
    let hashedPassword: string | null = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = await prisma.user.create({
      data: {
        name: formattedName,
        email: cleanEmail,
        password: hashedPassword,
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

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${newUser.name}`,
      user: newUser,
    });
  } catch (error: any) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to authenticate" },
      { status: 500 }
    );
  }
}

