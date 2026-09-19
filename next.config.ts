import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets a phone on the same hotspot/LAN load the dev server's scripts
  // (e.g. http://172.20.10.10:3000). Has no effect on production builds.
  allowedDevOrigins: ["172.20.10.*", "192.168.*.*"],
};

export default nextConfig;
