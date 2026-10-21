import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Decap's admin is a static page in public/admin; Next serves public files only by their full path,
  // so /admin (where /admin/ redirects) would 404 without this.
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default nextConfig;
