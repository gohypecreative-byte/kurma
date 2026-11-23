/**
 * Server and backend configuration utilities.
 * Dynamically resolves port and host from environment variables without hardcoding.
 */

export function getServerPort(): number {
  const envPort = process.env.PORT;
  if (envPort) {
    const parsed = parseInt(envPort, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 5000;
}

export function getServerBaseUrl(req?: Request): string {
  // If request is provided, derive directly from host headers
  if (req) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "http";
    if (host) {
      return `${proto}://${host}`;
    }
  }

  // Fallback to dynamic port resolution
  const port = getServerPort();
  return `http://localhost:${port}`;
}
