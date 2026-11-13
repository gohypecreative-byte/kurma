import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Ensure global type declaration for Next.js hot reload in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DEFAULT_DATABASE_URL =
  "postgresql://neondb_owner:npg_GLv3TOMBhWi0@ep-lively-field-b3vnumrd-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

function sanitizeDatabaseUrl(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  let str = raw.trim();
  // Strip surrounding double quotes or single quotes (often present when pasted into Vercel UI)
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    str = str.slice(1, -1).trim();
  }
  if (!str || str === "undefined" || str === "null") {
    return undefined;
  }
  try {
    // Validate that it forms a valid URL
    new URL(str);
    return str;
  } catch {
    return undefined;
  }
}

function resolveConnectionString(): string {
  const envUrl =
    sanitizeDatabaseUrl(process.env.DATABASE_URL) ||
    sanitizeDatabaseUrl(process.env.POSTGRES_PRISMA_URL) ||
    sanitizeDatabaseUrl(process.env.POSTGRES_URL) ||
    sanitizeDatabaseUrl(process.env.POSTGRES_URL_NON_POOLING) ||
    sanitizeDatabaseUrl(process.env.NEON_DATABASE_URL);

  return envUrl || DEFAULT_DATABASE_URL;
}

function createPrismaClient(): PrismaClient {
  const connectionString = resolveConnectionString();

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
