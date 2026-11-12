import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    // Run a quick query against Neon DB to verify connectivity
    const [userCount, productCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
    ]);

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      provider: "Neon PostgreSQL",
      latencyMs: `${latencyMs}ms`,
      counts: {
        users: userCount,
        products: productCount,
        orders: orderCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Database connection error in /api/health:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: error?.message || "Failed to communicate with Neon DB",
      },
      { status: 503 }
    );
  }
}

