import type { NextConfig } from "next";

/**
 * GitHub project Pages serves at /sidequest-atlas/.
 * Set NEXT_PUBLIC_BASE_PATH=/sidequest-atlas in the CI production build.
 * Leave unset (or "") for local dev and e2e.
 */
const rawBase = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = rawBase && rawBase.length > 0 ? rawBase : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
