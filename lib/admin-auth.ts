import { NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "kurma_admin_session";
const ADMIN_JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "kurma-atelier-sovereign-secret-2026-royal-key";

export const KNOWN_ADMIN_EMAILS = [
  "admin@kurmaluxury.com",
  "admin@kurma.com",
  "vishal1@gmail.com",
  "vishalsingh123764@gmail.com",
];

export function isDesignatedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  if (KNOWN_ADMIN_EMAILS.includes(clean)) return true;
  const envAdmin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (envAdmin && clean === envAdmin) return true;
  return false;
}

export interface AdminTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN";
  exp: number; // Unix timestamp in seconds
}

function base64UrlEncode(data: Uint8Array | string): string {
  const str =
    typeof data === "string"
      ? Buffer.from(data, "utf-8").toString("base64")
      : Buffer.from(data).toString("base64");
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(ADMIN_JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a cryptographically signed HMAC-SHA256 JWT token for an admin session.
 */
export async function createAdminToken(
  payload: Omit<AdminTokenPayload, "exp">,
  expiresInSeconds: number = 7 * 24 * 3600
): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const tokenPayload: AdminTokenPayload = {
    ...payload,
    role: "ADMIN",
    exp,
  };
  const body = base64UrlEncode(JSON.stringify(tokenPayload));
  const unsigned = `${header}.${body}`;

  const key = await getHmacKey();
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(unsigned)
  );
  const signature = base64UrlEncode(new Uint8Array(signatureBytes));

  return `${unsigned}.${signature}`;
}

/**
 * Verifies and decodes an admin session token.
 * Returns null if the token is invalid, expired, or not an ADMIN.
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminTokenPayload | null> {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, bodyB64, sigB64] = parts;
    const unsigned = `${headerB64}.${bodyB64}`;

    const key = await getHmacKey();
    const expectedSigBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(unsigned)
    );
    const expectedSigB64 = base64UrlEncode(new Uint8Array(expectedSigBytes));

    if (sigB64 !== expectedSigB64) {
      return null;
    }

    const payloadJson = base64UrlDecode(bodyB64);
    const payload = JSON.parse(payloadJson) as AdminTokenPayload;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null;
    }

    // Role must strictly be ADMIN
    if (payload.role !== "ADMIN") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts the admin token from either the Cookie or Authorization header.
 */
export function extractAdminToken(req: Request): string | null {
  // 1. Check Authorization Bearer header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  // 2. Check Cookie header
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${ADMIN_COOKIE_NAME}=`)) {
        return decodeURIComponent(cookie.slice(ADMIN_COOKIE_NAME.length + 1));
      }
    }
  }

  return null;
}

/**
 * Helper to attach the secure admin session cookie to a NextResponse.
 */
export function attachAdminSessionCookie(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  return response;
}

/**
 * Helper to remove the admin session cookie from a NextResponse upon logout.
 */
export function removeAdminSessionCookie(
  response: NextResponse
): NextResponse {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

/**
 * Backend authorization middleware helper.
 * Validates the admin session token on the request.
 * If unauthorized or not an admin, returns a structured 401 or 403 NextResponse.
 */
export async function verifyAdminRequest(
  req: Request
): Promise<
  | { authorized: true; user: AdminTokenPayload }
  | { authorized: false; response: NextResponse }
> {
  const token = extractAdminToken(req);

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Admin authentication session required" },
        { status: 401 }
      ),
    };
  }

  const payload = await verifyAdminToken(token);
  if (!payload) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Invalid or expired admin credentials" },
        { status: 401 }
      ),
    };
  }

  if (payload.role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Forbidden: Administrator role required" },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user: payload,
  };
}

