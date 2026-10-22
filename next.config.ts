import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Decap's admin is a static page in public/admin; Next serves public files only by their full path,
  // so /admin (where /admin/ redirects) would 404 without this.
  // The engine is its own deployment (nebulith on Railway); every engine link on this site, old shared
  // ones included, goes there with the rest of its path.
  async redirects() {
    return [{ source: "/personal-projects/game-engine/:path*", destination: "https://nebulith-production.up.railway.app/:path*", permanent: true }];
  },
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default nextConfig;
