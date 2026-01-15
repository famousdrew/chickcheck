import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for optimized Docker/Railway deployment
  output: "standalone",

  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig;
