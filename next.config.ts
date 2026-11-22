import type { NextConfig } from "next";
import { ENGINE_URL } from "./src/lib/engineLink";
import { securityHeaders } from "./src/lib/securityHeaders";

const nextConfig: NextConfig = {
  // No X-Powered-By: the framework name helps nobody but a scanner.
  poweredByHeader: false,
  // CSP, HSTS, referrer and permissions policy for every path (src/lib/securityHeaders.ts).
  async headers() {
    return securityHeaders(process.env.NODE_ENV === "development" ? "development" : "production");
  },
  // Old shared engine links (the engine used to be framed here) go to nebulith with the rest of their path.
  async redirects() {
    return [{ source: "/personal-projects/game-engine/:path*", destination: `${ENGINE_URL}/:path*`, permanent: true }];
  },
  // Decap's admin is a static page in public/admin; Next serves public files only by their full path,
  // so /admin (where /admin/ redirects) would 404 without this.
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default nextConfig;
