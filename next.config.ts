import type { NextConfig } from "next";

const cvAssets = ["./public/fonts/cv/**"];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.20.10.*", "192.168.*.*"],
  outputFileTracingIncludes: {
    "/cv/**": cvAssets,
    "/api/admin/**": cvAssets,
  },
};

export default nextConfig;
