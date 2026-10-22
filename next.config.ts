import type { NextConfig } from "next";
import { ENGINE_URL } from "./src/lib/engineLink";

const nextConfig: NextConfig = {
  // Decap's admin is a static page in public/admin; Next serves public files only by their full path,
  // so /admin (where /admin/ redirects) would 404 without this.
  // Old shared engine links (the engine used to be framed here) go to nebulith with the rest of their path.
  async redirects() {
    return [{ source: "/personal-projects/game-engine/:path*", destination: `${ENGINE_URL}/:path*`, permanent: true }];
  },
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default nextConfig;
