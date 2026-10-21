import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Default to `.next`; an isolated validation/dev server can set NEXT_DIST_DIR (e.g. `.next-validate`)
  // so it never writes the same build dir as the primary dev server: concurrent servers sharing one
  // `.next` corrupt the build manifests. No-op for normal `npm run dev`/`build`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Decap's admin is a static page in public/admin; Next serves public files only by their full path,
  // so /admin (where /admin/ redirects) would 404 without this.
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default withNextIntl(nextConfig);
