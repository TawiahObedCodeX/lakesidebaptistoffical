import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "172.20.10.3",
    "30.30.100.163",
    "192.168.80.1"
  ],
  reactStrictMode: true,
  // Ensure no rewrites that capture /api/*
  async rewrites() {
    return [];
  },
};

export default nextConfig;
