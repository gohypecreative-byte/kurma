import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyAdminRequest,
  createAdminToken,
  attachAdminSessionCookie,
  removeAdminSessionCookie,
  isDesignatedAdminEmail,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/admin-session
 * Checks whether the incoming request has a valid, active admin session.
 */
export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return auth.response;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        ...auth.user,
        name: "Admin",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error?.message || "Session verification failed" },
      { status: 401 }
    );
  }
}

/**
 * POST /api/auth/admin-session
 * Handles admin session sync/verification or logout.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // Action 1: Auto-verify and sync active admin session from client
    if (body?.action === "sync" && body?.email) {
      const cleanEmail = String(body.email).trim().toLowerCase();
      const isDesignated = isDesignatedAdminEmail(cleanEmail);

      let user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          memberSince: true,
        },
      });

      if (!user && isDesignated) {
        user = await prisma.user.create({
          data: {
            name: cleanEmail.includes("vishal") ? "Vishal Singh" : "Kurma Atelier Sovereign Administrator",
            email: cleanEmail,
            role: "ADMIN",
            memberSince: "January 2026",
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            memberSince: true,
          },
        });
      }

      const isAdmin = user?.role === "ADMIN" || isDesignated;

      if (!user || !isAdmin) {
        return NextResponse.json(
          {
            authenticated: false,
            error: "Forbidden: Account does not have administrator privileges",
          },
          { status: 403 }
        );
      }

      // If user is admin in system, ensure role is persisted in DB
      if (user.role !== "ADMIN") {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
        user.role = "ADMIN";
      }

      const token = await createAdminToken({
        userId: user.id,
        email: user.email,
        name: "Admin",
        role: "ADMIN",
      });

      const response = NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          name: "Admin",
          email: user.email,
          role: "ADMIN",
          memberSince: user.memberSince,
        },
      });

      return attachAdminSessionCookie(response, token);
    }

    // Action 2: Logout / Revoke Session
    const response = NextResponse.json({
      success: true,
      message: "Admin session terminated successfully",
    });
    return removeAdminSessionCookie(response);
  } catch (error: any) {
    console.error("Error in POST /api/auth/admin-session:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process session action" },
      { status: 500 }
    );
  }
}

