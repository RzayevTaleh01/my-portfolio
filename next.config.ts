import type { NextConfig } from "next";

// Fonts and photo of the generated CV, read from disk when a PDF is rebuilt after a save in /admin.
const cvAssets = ["./public/fonts/cv/**", "./public/avatar-cv.jpg"];

const nextConfig: NextConfig = {
  // Dev only: lets a phone on the same hotspot/LAN load the dev server's scripts
  // (e.g. http://172.20.10.10:3000). Has no effect on production builds.
  allowedDevOrigins: ["172.20.10.*", "192.168.*.*"],
  outputFileTracingIncludes: {
    "/cv/**": cvAssets,
    "/api/admin/**": cvAssets,
  },
};

export default nextConfig;
